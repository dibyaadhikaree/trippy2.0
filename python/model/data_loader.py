import requests
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

class DataLoader:
    def __init__(self):
        self.places_url = "http://localhost:2000/api/places"
        self.users_url = "http://localhost:2000/api/users"
        self._cached_places = []
        self._cached_users = []
        self._place_likes = defaultdict(int)

    def invalidate_cache(self):
        self._cached_places = []
        self._cached_users = []
        self._place_likes.clear()
        logger.debug("All data caches cleared")

    def load_users(self, force_reload=False):
        try:
            if force_reload or not self._cached_users:
                logger.info("Loading fresh users data")
                response = requests.get(self.users_url, timeout=10)
                response.raise_for_status()
                self._cached_users = response.json().get('data', [])
                self._update_place_likes()
            return self._cached_users.copy()
        except Exception as e:
            logger.error(f"User load failed: {str(e)}")
            return []

    def load_places(self, force_reload=False):
        try:
            if force_reload or not self._cached_places:
                logger.info("Loading fresh places data")
                response = requests.get(self.places_url, timeout=10)
                response.raise_for_status()
                self._cached_places = response.json().get('data', [])
                self._enhance_places_data()
            return self._cached_places.copy()
        except Exception as e:
            logger.error(f"Place load failed: {str(e)}")
            return []

    def _update_place_likes(self):
        self._place_likes.clear()
        for user in self._cached_users:
            for pid in user.get('likedPlaces', []):
                self._place_likes[pid] += 1

    def _enhance_places_data(self):
        for place in self._cached_places:
            place['like_count'] = self._place_likes.get(place['_id'], 0)
            place.setdefault('reviews', [])
            place.setdefault('categories', [])
            place.setdefault('sentiment_avg', 0.0)