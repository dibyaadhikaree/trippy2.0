import requests
import logging
from collections import defaultdict
from .data_loader import DataLoader
from .sentiment import SentimentAnalyzer
from .recommender import Recommender
from .user_manager import UserManager

logger = logging.getLogger(__name__)

class Refresher:
    def __init__(self):
        self.loader = DataLoader()
        self.sentiment = SentimentAnalyzer()
        self.recommender = Recommender()
        self.users = UserManager()
        self.processed_places = defaultdict(list)

    def process_reviews(self, places):
        """Calculate missing sentiment scores and update places"""
        try:
            logger.info("Processing reviews for %d places", len(places))
            updated_places = []
            
            for place in places:
                needs_update = False
                total_sentiment = 0
                valid_reviews = 0
                
                for review in place.get('reviews', []):
                    if 'sentiment_score' not in review or review['sentiment_score'] is None:
                        score = self.sentiment.analyze_sentiment(
                            review.get('text', ''), 
                            review.get('timestamp')
                        )
                        review['sentiment_score'] = score
                        needs_update = True
                    
                    if isinstance(review.get('sentiment_score'), (int, float)):
                        total_sentiment += review['sentiment_score']
                        valid_reviews += 1

                place['sentiment_avg'] = total_sentiment / valid_reviews if valid_reviews > 0 else 0
                
                if needs_update:
                    try:
                        response = requests.patch(
                            f"{self.loader.places_url}/{place['_id']}",
                            json=place,
                            timeout=5
                        )
                        if response.status_code == 200:
                            updated_places.append(place['_id'])
                    except Exception as e:
                        logger.error(f"Failed to update place {place['_id']}: {str(e)}")

            logger.info("Updated %d places with new sentiment scores", len(updated_places))
            return places

        except Exception as e:
            logger.error(f"Review processing failed: {str(e)}")
            return places

    def refresh(self, users_changed, places_changed, reviews_changed):
        """Main refresh entry point with full error handling"""
        try:
            logger.info(
                "Starting refresh - Users: %s, Places: %s, Reviews: %s", users_changed, places_changed, reviews_changed)
            
            # Always load fresh places first
            places = self.loader.load_places(force_reload=places_changed or reviews_changed or users_changed)

            # Process reviews FIRST to ensure sentiment scores are current
            if reviews_changed or places_changed:
                logger.debug("Processing reviews and places")
                places = self.process_reviews(places)
                self.recommender.build_matrix(places)

            # Process users AFTER places to ensure category data exists
            if users_changed:
                logger.debug("Processing user changes")
                users = self.loader.load_users(force_reload=True)
                updated_users = self.users.update_preferences(users, places)
                
                # Persist updated preferences to backend
                for user in updated_users:
                    try:
                        response = requests.patch(
                            f"{self.loader.users_url}/{user['_id']}",
                            json={"preferences": user['preferences']},
                            timeout=3
                        )
                        if response.status_code != 200:
                            logger.warning(f"Failed to save preferences for {user['_id']}")
                    except Exception as e:
                        logger.error(f"User preference save failed: {str(e)}")

                # Rebuild collaborative model with FRESH data
                users = self.loader.load_users(force_reload=True)  # Reload after updates
                self.recommender.collab.build(users)
                
                # Invalidate recommendation cache
                self.recommender.last_user_reload = None

            logger.info("Refresh completed successfully")
            return True

        except requests.exceptions.RequestException as e:
            logger.error("Network error during refresh: %s", str(e))
            return False
            
        except Exception as e:
            logger.error("Critical refresh failure: %s", str(e), exc_info=True)
            return False