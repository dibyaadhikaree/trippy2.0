import numpy as np
import logging
import time
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
        self.last_rebuild = 0

    def build_matrix(self, places):
        try:
            logger.info("Rebuilding category matrix")
            valid_places = [p for p in places if p.get('categories')]
            self.places = valid_places
            self.mlb.fit([p['categories'] for p in valid_places])
            self.cat_matrix = self.mlb.transform([p['categories'] for p in valid_places])
            self.last_rebuild = time.time()
        except Exception as e:
            logger.error(f"Matrix build failed: {str(e)}")
            self.cat_matrix = None

    def recommend(self, user_id, top_n=10):
        try:
            users = self.loader.load_users(force_reload=True)
            places = self.loader.load_places(force_reload=True)
            user = next((u for u in users if str(u.get('_id')) == str(user_id)), None)
            
            if user is None:
                logger.warning(f"User {user_id} not found")
                return []

            updated_users = self.manager.update_preferences([user], places)
            if bool(updated_users):
                user = updated_users[0]

            if self.cat_matrix is None or (time.time() - self.last_rebuild > 3600):
                self.build_matrix(places)
                self.collab.build(updated_users)

            user_prefs = user.get('preferences', [])
            user_liked = set(map(str, user.get('likedPlaces', [])))
            
            if user_prefs and self.cat_matrix is not None:
                user_vec = self.mlb.transform([user_prefs])[0]
            else:
                user_vec = np.zeros(self.cat_matrix.shape[1]) if self.cat_matrix is not None else np.array([])

            content_scores = self.cat_matrix.dot(user_vec) if self.cat_matrix is not None else np.zeros(len(places))

            collab_scores = defaultdict(float)
            if str(user_id) in self.collab.user_similarities:
                for similar_user, similarity in self.collab.user_similarities[str(user_id)].items():
                    for pid in self.collab.user_likes.get(str(similar_user), []):
                        if pid not in user_liked:
                            collab_scores[pid] += similarity
            collab_scores = self.collab.get_recommendations(user_id, exclude_liked=True)

            results = []
            for idx, place in enumerate(self.places):
                pid = str(place['_id'])
                if pid in user_liked:
                    continue

                category_score = content_scores[idx] / len(user_prefs) if user_prefs else 0
                sentiment_score = place['sentiment_avg'] if place['sentiment_avg'] else 0
                rate_score = min(max(place['rate'] if place['rate'] else 0, 5), 0) / 5
                collaborative_score = collab_scores.get(pid, 0)

                total = (0.6 * (0.6 * category_score + 0.3 * sentiment_score + 0.1 * rate_score)
                        + 0.4 * collaborative_score)
                results.append((pid, total))

            filtered = [(pid, score) for pid, score in results if pid not in user_liked]
            return [pid for pid, _ in sorted(filtered, key=lambda x: -x[1])[:top_n]]
        
        except Exception as e:
            logger.error(f"Recommendation failed: {str(e)}", exc_info=True)
            return []