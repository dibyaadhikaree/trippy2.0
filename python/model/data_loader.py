import requests
from collections import defaultdict

class DataLoader:
    def __init__(self):
        self.places_url = "http://localhost:2000/api/places"
        self.users_url = "http://localhost:2000/api/users"

    def load_users(self):
        response = requests.get(self.users_url)
        return response.json().get('data', [])

    def load_places(self):
        response = requests.get(self.places_url)
        places = response.json().get('data', [])
        users = self.load_users()
        
        place_likes = defaultdict(int)
        for user in users:
            for pid in user.get('likedPlaces', []):
                place_likes[pid] += 1
        
        for place in places:
            place['like_count'] = place_likes.get(place['_id'], 0)
            place.setdefault('reviews', [])
        
        return places