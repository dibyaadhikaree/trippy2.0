import numpy as np
import logging
from collections import defaultdict
from sklearn.preprocessing import MultiLabelBinarizer
from .data_loader import DataLoader
from .user_manager import UserManager
from .collaborative import CollaborativeFilter

logger = logging.getLogger(__name__)

class Recommender:
    def __init__(self):
        self.loader = DataLoader()
        self.users = UserManager()
        self.mlb = MultiLabelBinarizer()
        self.places = []
        self.cat_matrix = None
        self.collab = CollaborativeFilter()

    def build_matrix(self, places):
        try:
            logger.info("Building category matrix")
            valid_places = [p for p in places if 'categories' in p]
            self.places = valid_places
            self.cat_matrix = self.mlb.fit_transform([p['categories'] for p in valid_places])
        except Exception as e:
            logger.error(f"Matrix build failed: {str(e)}")
            self.cat_matrix = None

    def recommend(self, user_id, top_n=10):
        try:
            logger.info(f"Generating recommendations for user {user_id}")
            users = {u['_id']: u for u in self.loader.load_users()}
            user = users.get(user_id)
            
            if not user or not user.get('preferences'):
                return []

            if self.cat_matrix is None:
                self.build_matrix(self.loader.load_places())

            user_prefs = user.get('preferences', [])  
            # change code here get user_prefs with headCategory :=> food and drinks , outdoors etc , get mapped  category here 
            user_vec = self.mlb.transform([user_prefs])[0]
            scores = self.cat_matrix.dot(user_vec)
            
            collab_scores = defaultdict(float)
            for similar_user, similarity in self.collab.user_similarities.get(user_id, {}).items():
                for pid in users.get(similar_user, {}).get('likedPlaces', []):
                    collab_scores[pid] += similarity

            results = []
            for idx, place in enumerate(self.places):
                if place['_id'] in user.get('likedPlaces', []):
                    continue
                
                category_score = scores[idx] / len(user_prefs) if user_prefs else 0
                sentiment = place.get('sentiment_avg', 0)
                rate = min(max(place.get('rate', 0), 0), 5) / 5
                collaborative = collab_scores.get(place['_id'], 0)
                
                total = 0.6*(0.6*category_score + 0.3*sentiment + 0.1*rate) + 0.4*collaborative
                results.append((place['_id'], total))
            
            return [pid for pid, _ in sorted(results, key=lambda x: -x[1])[:top_n]]
        except Exception as e:
            logger.error(f"Recommendation failed: {str(e)}")
            return []