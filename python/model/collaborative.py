import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

class CollaborativeFilter:
    def __init__(self):
        self.user_similarities = defaultdict(dict)
        self.user_likes = defaultdict(set)

    def build(self, users):
        try:
            logger.info("Building collaborative model")
            # Clear previous state
            self.user_similarities.clear()
            self.user_likes.clear()
            
            # Process users
            for user in users:
                self.user_likes[user['_id']] = set(user.get('likedPlaces', []))
            
            # Compute similarities
            user_ids = list(self.user_likes.keys())
            for i in range(len(user_ids)):
                for j in range(i+1, len(user_ids)):
                    uid1 = user_ids[i]
                    uid2 = user_ids[j]
                    intersection = len(self.user_likes[uid1] & self.user_likes[uid2])
                    union = len(self.user_likes[uid1] | self.user_likes[uid2])
                    if union > 0:
                        similarity = intersection / union
                        self.user_similarities[uid1][uid2] = similarity
                        self.user_similarities[uid2][uid1] = similarity
        except Exception as e:
            logger.error(f"Collaborative build error: {str(e)}")