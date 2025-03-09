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
        self.manager = UserManager()
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
            
            # Fallback for invalid users or empty preferences
            if not user or not user.get('preferences'):
<<<<<<< HEAD
                if user.get('likedPlaces'):
                    logger.info("Generating initial preferences from liked places")
                    self.manager.update_preferences([user], self.loader.load_places())
                    user = next(u for u in users if u['_id'] == user_id)
                else:
                    return []
=======
                print("no user")
                return []
>>>>>>> ce1d28e8f453ab0d6a03a22436dcf3842767be6a

            # Build category matrix if missing
            if self.cat_matrix is None:
                self.build_matrix(self.loader.load_places())

            # Get user's liked places for filtering
            user_liked = set(user.get('likedPlaces', []))
            
            # Content-based scoring
            user_prefs = user.get('preferences', [])
            user_vec = self.mlb.transform([user_prefs])[0]
            scores = self.cat_matrix.dot(user_vec)
            
            # Collaborative filtering scoring
            collab_scores = defaultdict(float)
            if user_id in self.collab.user_similarities:
                for similar_user, similarity in self.collab.user_similarities[user_id].items():
                    liked_places = users.get(similar_user, {}).get('likedPlaces', [])
                    for pid in liked_places:
                        if pid not in user_liked:  # Filter upfront
                            collab_scores[pid] += similarity

            # Hybrid scoring with sentiment integration
            results = []
            for idx, place in enumerate(self.places):
                pid = place['_id']
                
                # Skip already-liked places
                if pid in user_liked:
                    continue
                
                # Content-based components
                category_score = scores[idx] / len(user_prefs) if user_prefs else 0
                sentiment_score = place.get('sentiment_avg', 0)
                rate_score = min(max(place.get('rate', 0), 0), 5) / 5
                
                # Collaborative component
                collaborative_score = collab_scores.get(pid, 0)
                
                # Final weighted score
                total = 0.6 * (0.6 * category_score + 0.3 * sentiment_score + 0.1 * rate_score) + 0.4 * collaborative_score
                
                results.append((pid, total))
            
            # Return top N after sorting
            return [pid for pid, _ in sorted(results, key=lambda x: -x[1])[:top_n]]
        
        except Exception as e:
            logger.error(f"Recommendation failed: {str(e)}")
            return []