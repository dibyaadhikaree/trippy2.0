import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

class UserManager:
    def __init__(self):
        self.place_categories = defaultdict(list)

    def update_preferences(self, users, places):
        try:
            logger.info("Updating preferences for %d users", len(users))
            place_map = {str(p['_id']): p.get('categories', []) for p in places}
            updated_users = []
            
            for user in users:
                if not isinstance(user, dict) or '_id' not in user:
                    continue
                
                liked_places = [str(pid) for pid in user.get('likedPlaces', [])]
                if not liked_places:
                    continue
                
                new_prefs = set()
                for pid in liked_places:
                    new_prefs.update(place_map.get(pid, []))
                
                current_prefs = set(map(str, user.get('preferences', [])))
                if new_prefs != current_prefs:
                    user['preferences'] = list(new_prefs)
                    updated_users.append(user)
            
            return list(updated_users)
        except Exception as e:
            logger.error(f"Preference update failed: {str(e)}", exc_info=True)
            return []