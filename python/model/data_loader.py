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

    def load_users(self, force_reload=False):
        try:
            if force_reload or not self._cached_users:
                logger.info("Loading users from API")
                response = requests.get(self.users_url, timeout=10)
                response.raise_for_status()
                self._cached_users = response.json().get('data', [])
            return self._cached_users.copy()
        except Exception as e:
            logger.error(f"Failed to load users: {str(e)}")
            return []

    def load_places(self, force_reload=False):
        try:
            if force_reload or not self._cached_places:
                logger.info("Loading places from API")
                response = requests.get(self.places_url, timeout=10)
                response.raise_for_status()
                raw_places = response.json().get('data', [])

                users = self.load_users()
                place_likes = defaultdict(int)
                for user in users:
                    for pid in user.get('likedPlaces', []):
                        place_likes[pid] += 1

                for place in raw_places:
                    place['like_count'] = place_likes.get(place['_id'], 0)
                    place.setdefault('reviews', [])
                    place.setdefault('categories', [])

                self._cached_places = raw_places
            return self._cached_places.copy()
        except Exception as e:
            logger.error(f"Failed to load places: {str(e)}")
            return []