class UserManager:
    def __init__(self):
        self.place_cats = {}

    def update_preferences(self, users, places):
        self.place_cats = {p['place_id']: p['categories'] for p in places}
        updated = []
        
        for user in users:
            cats = set()
            for pid in user.get('likedPlaces', []):
                cats.update(self.place_cats.get(pid, []))
            
            new_prefs = list(cats)
            if new_prefs != user.get('preferences', []):
                user['preferences'] = new_prefs
                updated.append(user)
        
        return updated