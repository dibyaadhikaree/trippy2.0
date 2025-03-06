import requests
import logging
from .data_loader import DataLoader
from .sentiment import SentimentAnalyzer
from .recommender import Recommender
from .user_manager import UserManager

logger = logging.getLogger(__name__)

class Refresher:
    def __init__(self):
        self.loader = DataLoader()
        self.sentiment = SentimentAnalyzer()
        self.recommender = Recommender()
        self.users = UserManager()

    def process_reviews(self, places):
        try:
            logger.info("Processing reviews")
            for place in places:
                total = 0
                valid = 0
                needs_update = False
                
                for review in place.get('reviews', []):
                    if 'sentiment_score' not in review or review.get('sentiment_score', None) is None:
                        text = review.get('text', '')
                        score = self.sentiment.analyze(text, review.get('timestamp'))
                        review['sentiment_score'] = score
                        needs_update = True
                    
                    if 'sentiment_score' in review:
                        total += review['sentiment_score']
                        valid += 1
                
                if valid > 0:
                    place['sentiment_avg'] = total / valid
                else:
                    place['sentiment_avg'] = 0
                
                if needs_update:
                    requests.patch(f"{self.loader.places_url}/{place['_id']}", json=place)
            
            return places
        except Exception as e:
            logger.error(f"Review processing failed: {str(e)}")
            return places

    def refresh(self, users_changed, places_changed, reviews_changed):
        try:
            logger.info(f"Refresh triggered - users:{users_changed} places:{places_changed} reviews:{reviews_changed}")
            places = self.loader.load_places(force_reload=places_changed or reviews_changed)
            
            if reviews_changed:
                places = self.process_reviews(places)
            
            if places_changed:
                self.recommender.build_matrix(places)
            
            if users_changed:
                users = self.loader.load_users(force_reload=True)
                updated = self.users.update_preferences(users, places)
                for user in updated:
                    requests.patch(f"{self.loader.users_url}/{user['_id']}", json=user)
        except Exception as e:
            logger.error(f"Refresh failed: {str(e)}")