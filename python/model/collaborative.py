import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

class CollaborativeFilter:
    def __init__(self):
        self.user_similarities = defaultdict(dict)
        self.user_matrix = {}

    def build(self, users):
        try:
            logger.info("Building collaborative filtering model")
            self.user_matrix = {
                u['_id']: set(u.get('likedPlaces', [])) 
                for u in users
            }
            self._compute_similarities()
        except Exception as e:
            logger.error(f"Collaborative build failed: {str(e)}")

    def _compute_similarities(self):
        user_ids = list(self.user_matrix.keys())
        for i, uid1 in enumerate(user_ids):
            set1 = self.user_matrix[uid1]
            for j in range(i+1, len(user_ids)):
                uid2 = user_ids[j]
                set2 = self.user_matrix.get(uid2, set())
                intersection = len(set1 & set2)
                union = len(set1 | set2)
                if union > 0:
                    similarity = intersection / union
                    self.user_similarities[uid1][uid2] = similarity
                    self.user_similarities[uid2][uid1] = similarity