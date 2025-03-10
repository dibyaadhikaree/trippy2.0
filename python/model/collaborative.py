import logging
from collections import defaultdict
import numpy as np

logger = logging.getLogger(__name__)

class CollaborativeFilter:
    def __init__(self):
        self.user_similarities = defaultdict(dict)  
        self.user_likes = defaultdict(set)         
        self.place_users = defaultdict(set)     
        self.user_matrix = {}                 

    def build(self, users):
        try:
            logger.info("Building collaborative filtering model")
            self._clear_state()
            self._process_users(users)
            self._compute_similarities()
            logger.info(f"Built model for {len(self.user_likes)} users")
        except Exception as e:
            logger.error(f"Collaborative build failed: {str(e)}")

    def _clear_state(self):
        self.user_similarities.clear()
        self.user_likes.clear()
        self.place_users.clear()
        self.user_matrix.clear()

    def _process_users(self, users):
        """Process user data into internal structures"""
        # First pass: collect all liked places
        all_liked = set()
        for user in users:
            liked_places = set(map(str, user.get('likedPlaces', [])))
            all_liked.update(liked_places)
        
        # Build complete place_users index
        self.place_users = {pid: set() for pid in all_liked}
        
        # Second pass: process users with complete place set
        for user in users:
            user_id = str(user.get('_id'))
            liked_places = set(map(str, user.get('likedPlaces', [])))
            
            # Store user likes
            self.user_likes[user_id] = liked_places
            
            # Build place-user index
            for pid in liked_places:
                self.place_users[pid].add(user_id)
            
            # Create user vector with stable dimension
            self.user_matrix[user_id] = self._create_user_vector(liked_places)

    def _create_user_vector(self, liked_places):
        """Create a normalized vector representing user preferences"""
        if not self.place_users:
            return np.array([])  # Return empty array if no places
        
        vector = np.zeros(len(self.place_users))
        for idx, pid in enumerate(self.place_users):
            vector[idx] = 1 if pid in liked_places else 0
        
        norm = np.linalg.norm(vector)
        return vector / norm if norm > 0 else vector

    def _compute_similarities(self):
        """Calculate cosine similarity between users"""
        user_ids = list(self.user_matrix.keys())
        for i in range(len(user_ids)):
            for j in range(i + 1, len(user_ids)):
                uid1 = user_ids[i]
                uid2 = user_ids[j]
                
                # Skip users with empty vectors
                if len(self.user_matrix[uid1]) == 0 or len(self.user_matrix[uid2]) == 0:
                    continue
                    
                # Verify vector dimensions match
                if len(self.user_matrix[uid1]) != len(self.user_matrix[uid2]):
                    logger.error(f"Vector dimension mismatch between {uid1} and {uid2}")
                    continue
                    
                # Calculate cosine similarity
                similarity = np.dot(
                    self.user_matrix[uid1],
                    self.user_matrix[uid2]
                )
                
                if similarity > 0:
                    self.user_similarities[uid1][uid2] = similarity
                    self.user_similarities[uid2][uid1] = similarity

    def get_similar_users(self, user_id, top_n=5):
        """Get most similar users"""
        user_id = str(user_id)
        if user_id not in self.user_similarities:
            return []
            
        similar = sorted(
            self.user_similarities[user_id].items(),
            key=lambda x: -x[1]
        )[:top_n]
        return [(uid, float(sim)) for uid, sim in similar]

    def get_recommendations(self, user_id, exclude_liked=True):
        """Generate collaborative recommendations"""
        user_id = str(user_id)
        if user_id not in self.user_similarities:
            return {}

        recommendations = defaultdict(float)
        liked_places = self.user_likes[user_id] if exclude_liked else set()
        
        for similar_user, similarity in self.user_similarities[user_id].items():
            for pid in self.user_likes[similar_user]:
                if pid not in liked_places:
                    recommendations[pid] += similarity
                    
        return recommendations