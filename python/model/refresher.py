import requests
from model.data_loader import DataLoader
from model.sentiment_analyzer import SentimentAnalyzer
from model.recommender import Recommender
from model.user_manager import UserManager

class Refresher:
    def __init__(self):
        self.loader = DataLoader()
        self.sentiment = SentimentAnalyzer()
        self.recommender = Recommender()
        self.users = UserManager()

    def process_reviews(self, places):
        for place in places:
            total = 0
            valid = 0
            needs_update = False
            
            for review in place.get('reviews', []):
                if 'sentiment_score' not in review or review.get('sentiment_score', 0) == 0:
                    score = self.sentiment.analyze(review['text'], review.get('timestamp'))
                    review['sentiment_score'] = score
                    needs_update = True
                
                total += review.get('sentiment_score', 0)
                valid += 1
            
            if valid > 0:
                place['sentiment_avg'] = total / valid
                if needs_update:
                    requests.patch(f"{self.loader.places_url}/{place['place_id']}", json=place)
        
        return places

    def refresh(self, users_changed, places_changed, reviews_changed):
        places = self.loader.load_places()
        
        if reviews_changed:
            places = self.process_reviews(places)
        
        if places_changed:
            self.recommender.build_matrix(places)
        
        if users_changed:
            users = self.loader.load_users()
            updated = self.users.update_preferences(users, places)
            for user in updated:
                requests.patch(f"{self.loader.users_url}/{user['_id']}", json=user)