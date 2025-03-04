from model.data_loader import DataLoader
from model.preprocessor import Preprocessor
from model.similarity import compute_cosine_similarity, get_top_n_similar_places
import numpy as np

class Recommender:
    def __init__(self):
        self.data_loader = DataLoader()
        self.preprocessor = Preprocessor()
        self.places = self.data_loader.load_data()
        self.similarity_matrix = None

        if not self.places:
            raise Exception("Failed to load data. Please check the data source.")

        self.build_recommendation_model()

    def build_recommendation_model(self):
        """Builds and caches the similarity matrix and computes sentiment scores."""
        tfidf_matrix = self.preprocessor.vectorize_descriptions(self.places)
        self.similarity_matrix = compute_cosine_similarity(tfidf_matrix)

        self.preprocessor.compute_sentiment_scores(self.places)

    def refresh_data(self):
        """Reloads data and rebuilds the similarity matrix."""
        self.places = self.data_loader.load_data()
        if not self.places:
            raise Exception("Failed to refresh data.")
        self.build_recommendation_model()

    def recommend_places_by_id(self, place_id, top_n=5):
        """Recommend places based on a given place ID (_id)."""
        if self.similarity_matrix is None:
            self.build_recommendation_model()

        place_index = next((i for i, place in enumerate(self.places) if place['_id'] == place_id), None)
        if place_index is None:
            return []

        top_similar_indices = get_top_n_similar_places(self.similarity_matrix, place_index, top_n)

        return self._adjust_by_sentiment(top_similar_indices)

    def recommend_places_by_user_preferences(self, user_preferences, top_n=5):
        """Hybrid recommendation: TF-IDF similarity + weighted category matching."""
        if not user_preferences:
            return []

        filtered_places = [place for place in self.places if any(pref in place['categories'] for pref in user_preferences)]
        if not filtered_places:
            return []

        tfidf_matrix = self.preprocessor.vectorize_descriptions(filtered_places)
        similarity_matrix = compute_cosine_similarity(tfidf_matrix)

        category_scores = []
        for place in filtered_places:
            match_score = sum(pref in place['categories'] for pref in user_preferences) / len(user_preferences)
            category_scores.append(match_score)

        final_scores = np.array([0.6 * sim + 0.4 * cat for sim, cat in zip(similarity_matrix[0], category_scores)])
        top_indices = final_scores.argsort()[-top_n:][::-1]

        return self._adjust_by_sentiment([filtered_places[i] for i in top_indices])

    def get_popular_places(self, top_n=5):
        """Returns the top N most popular places based on 'rate' field and sentiment score."""
        def safe_int(value):
            """Attempts to convert a value to int, returns 0 if it fails."""
            try:
                return int(value)
            except (ValueError, TypeError):
                return 0

        sorted_places = sorted(
            self.places,
            key=lambda x: safe_int(x.get('rate', 0)) + x.get('sentiment_score', 0),
            reverse=True
        )
        return [place['_id'] for place in sorted_places[:top_n]]

    def _adjust_by_sentiment(self, places):
        """Boosts or reduces recommendations based on sentiment scores."""
        places_with_scores = [(place, place.get('sentiment_score', 0)) for place in places]
        places_with_scores.sort(key=lambda x: x[1], reverse=True)
        return [place['_id'] for place, _ in places_with_scores]