from model.data_loader import DataLoader

class Popularity:
    def __init__(self):
        self.loader = DataLoader()

    def calculate(self, top_n=10):
        places = self.loader.load_places()
        
        # Safely handle empty data
        if not places:
            return []

        # Safely get like_counts with fallback
        like_counts = [p.get('like_count', 0) for p in places]
        max_likes = max(like_counts) if like_counts else 1

        scores = []
        for place in places:
            # Safely access all fields
            likes = place.get('like_count', 0)
            sentiment = place.get('sentiment_avg', 0)
            rate = place.get('rate', 0)
            
            # Normalize values
            normalized_likes = likes / max_likes
            normalized_rate = rate / 5
            
            score = 0.4*normalized_rate + 0.3*sentiment + 0.3*normalized_likes
            scores.append((place['_id'], score))
        
        return [pid for pid, _ in sorted(scores, key=lambda x: -x[1])[:top_n]]