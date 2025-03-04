from sklearn.feature_extraction.text import TfidfVectorizer
import re
from model.sentiment import SentimentAnalyzer

class Preprocessor:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.sentiment_analyzer = SentimentAnalyzer()

    def preprocess_description(self, description):
        """Cleans and processes the place description."""
        if isinstance(description, str):
            description = description.lower()
            description = re.sub(r'\s+', ' ', description)
            description = re.sub(r'[^\w\s]', '', description)
        return description

    def preprocess_user_preferences(self, preferences):
        """Cleans and processes the user preferences."""
        return [pref.lower().strip() for pref in preferences]

    def vectorize_descriptions(self, places_data):
        """Vectorizes the descriptions of the places using TF-IDF."""
        descriptions = [self.preprocess_description(place['description']) for place in places_data]
        return self.vectorizer.fit_transform(descriptions)

    def compute_sentiment_scores(self, places_data):
        """Precomputes sentiment scores for each place."""
        for place in places_data:
            place['sentiment_score'] = self.sentiment_analyzer.analyze_sentiment(place.get('reviews', []))