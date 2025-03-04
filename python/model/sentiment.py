from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from datetime import datetime

class SentimentAnalyzer:
    def __init__(self):
        """Loads the Transformer model for aspect-based sentiment analysis."""
        self.tokenizer = AutoTokenizer.from_pretrained("kevinscaria/joint_tk-instruct-base-def-pos-neg-neut-combined")
        self.model = AutoModelForSeq2SeqLM.from_pretrained("kevinscaria/joint_tk-instruct-base-def-pos-neg-neut-combined")

    def analyze_sentiment(self, reviews):
        """Computes a sentiment score using all reviews, giving more weight to recent ones."""
        if not reviews:
            return 0

        sentiment_scores = []
        for review in reviews:
            text, timestamp = review.get('text', ''), review.get('timestamp', None)

            if not text:
                continue

            input_text = f"input: {text} \noutput:"
            inputs = self.tokenizer(input_text, return_tensors="pt")
            with torch.no_grad():
                output = self.model.generate(inputs.input_ids)
            decoded_output = self.tokenizer.decode(output[0], skip_special_tokens=True)

            if "positive" in decoded_output:
                sentiment = 1
            elif "negative" in decoded_output:
                sentiment = -1
            else:
                sentiment = 0

            weight = self._calculate_time_weight(timestamp)
            sentiment_scores.append(sentiment * weight)

        return sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0

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