from model.data_loader import DataLoader

class Popularity:
    def __init__(self):
        self.loader = DataLoader()

    def calculate(self, top_n=10):
        places = self.loader.load_places()
        max_likes = max((p['like_count'] for p in places), default=1)
        
        scores = []
        for place in places:
            nl = place['like_count'] / max_likes
            sa = place.get('sentiment_avg', 0)
            rt = place.get('rate', 0) / 5
            score = 0.4*rt + 0.3*sa + 0.3*nl
            scores.append((place['_id'], score))
        
        return [pid for pid, _ in sorted(scores, key=lambda x: -x[1])[:top_n]]