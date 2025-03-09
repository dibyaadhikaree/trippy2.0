import logging

logger = logging.getLogger(__name__)

class UserManager:
    def __init__(self):
        self.place_cats = {}

    def update_preferences(self, users, places):
        try:
            logger.info("Updating user preferences from liked places")
            self.place_cats = {p['_id']: p.get('categories', []) for p in places}
            updated_users = []
            
            for user in users:
                user_id = user.get('_id')
                liked_places = user.get('likedPlaces', [])
                
                # Extract categories from ALL liked places
                categories = set()
                for pid in liked_places:
                    categories.update(self.place_cats.get(pid, []))
                
                new_prefs = list(categories)
                current_prefs = user.get('preferences', [])
                
                # Always update preferences if user has liked places
                if liked_places and new_prefs != current_prefs:
                    user['preferences'] = new_prefs
                    updated_users.append(user)
                    logger.debug(f"Updated preferences for {user_id}: {new_prefs}")

            return updated_users
            
        except Exception as e:
            logger.error(f"Preference update failed: {str(e)}")
            return []