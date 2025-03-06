from model.data_loader import DataLoader
from model.user_manager import UserManager
from sklearn.preprocessing import MultiLabelBinarizer

class Recommender:
    def __init__(self):
        self.loader = DataLoader()
        self.users = UserManager()
        self.mlb = MultiLabelBinarizer()
        self.places = []
        self.cat_matrix = None

    def build_matrix(self, places):
        self.places = places
        self.cat_matrix = self.mlb.fit_transform([p['categories'] for p in places])

    def recommend(self, user_id, top_n=10):
        users = {u['_id']: u for u in self.loader.load_users()}
        user = users.get(user_id)
        if not user or not user.get('preferences'):
            return []
        
        user_vec = self.mlb.transform([user['preferences']])[0]
        scores = self.cat_matrix.dot(user_vec)
        
        results = []
        for idx, place in enumerate(self.places):
            if place['place_id'] in user.get('likedPlaces', []):
                continue
            
            cat_score = scores[idx] / len(user['preferences'])
            sent_score = place.get('sentiment_avg', 0)
            rate_score = place.get('rate', 0) / 5
            
            total = 0.6*cat_score + 0.3*sent_score + 0.1*rate_score
            results.append((place['place_id'], total))
        
        return [pid for pid, _ in sorted(results, key=lambda x: -x[1])[:top_n]]