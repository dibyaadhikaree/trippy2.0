from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from datetime import datetime


class SentimentAnalyzer:
    def __init__(self):
        """Loads the Transformer model for aspect-based sentiment analysis."""
        self.tokenizer = AutoTokenizer.from_pretrained("kevinscaria/joint_tk-instruct-base-def-pos-neg-neut-combined")
        self.model = AutoModelForSeq2SeqLM.from_pretrained("kevinscaria/joint_tk-instruct-base-def-pos-neg-neut-combined")
        
        # Pre-define the instruction template
        self.bos_instruction = """Definition: The output will be the aspects (both implicit and explicit) and the aspects sentiment polarity. In cases where there are no aspects the output should be noaspectterm:none.
Positive example 1-
input: With the great variety on the menu , I eat here often and never get bored.
output: menu:positive
Positive example 2- 
input: Great food, good size menu, great service and an unpretensious setting.
output: food:positive, menu:positive, service:positive, setting:positive
Negative example 1-
input: They did not have mayonnaise, forgot our toast, left out ingredients (ie cheese in an omelet), below hot temperatures and the bacon was so over cooked it crumbled on the plate when you touched it.
output: toast:negative, mayonnaise:negative, bacon:negative, ingredients:negative, plate:negative
Negative example 2-
input: The seats are uncomfortable if you are sitting against the wall on wooden benches.
output: seats:negative
Neutral example 1-
input: I asked for seltzer with lime, no ice.
output: seltzer with lime:neutral
Neutral example 2-
input: They wouldnt even let me finish my glass of wine before offering another.
output: glass of wine:neutral
Now complete the following example-
input: """

    def analyze_sentiment(self, reviews):
        """Computes a sentiment score using all reviews, considering multiple sentiment aspects and weighting recent ones."""
        if not reviews:
            return 0

        sentiment_scores = []
        for review in reviews:
            text, timestamp = review.get('text', ''), review.get('timestamp', None)
            if not text:
                continue

            # Create properly formatted input
            full_prompt = f"{self.bos_instruction}{text} \noutput:"
            
            # Tokenize with proper parameters
            inputs = self.tokenizer(
                full_prompt,
                return_tensors="pt",
                max_length=512,
                truncation=True
            )
            
            # Generate with beam search
            with torch.no_grad():
                output = self.model.generate(
                    inputs.input_ids,
                    max_length=128,
                    num_beams=4,
                    early_stopping=True
                )
            
            decoded_output = self.tokenizer.decode(output[0], skip_special_tokens=True)

            # Parse the output
            aspects = []
            if 'noaspectterm' in decoded_output.lower():
                continue
                
            for pair in decoded_output.split(', '):
                if ':' in pair:
                    try:
                        aspect, sentiment = pair.split(':', 1)
                        aspects.append(sentiment.strip().lower())
                    except:
                        continue

            # Count sentiments
            pos_count = sum(1 for s in aspects if s == 'positive')
            neg_count = sum(1 for s in aspects if s == 'negative')
            neu_count = sum(1 for s in aspects if s == 'neutral')

            total_aspects = pos_count + neg_count + neu_count
            if total_aspects == 0:
                sentiment = 0
            else:
                sentiment = (pos_count - neg_count) / total_aspects

            # Apply time weighting
            weight = self._calculate_time_weight(timestamp)
            sentiment_scores.append(sentiment * weight)

        if not sentiment_scores:
            return 0
        return sum(sentiment_scores) / len(sentiment_scores)

    def _calculate_time_weight(self, timestamp):
        """Calculates a time-based weight for sentiment scores."""
        if not timestamp:
            return 1

        try:
            review_date = datetime.strptime(timestamp, "%Y-%m-%d")
            days_old = (datetime.now() - review_date).days
            return 1 / (1 + days_old / 365)
        except ValueError:
            return 1