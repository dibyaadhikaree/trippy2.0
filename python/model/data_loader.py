import requests
from model.preprocessor import Preprocessor

class DataLoader:
    def __init__(self):
        self.api_url = "http://localhost:2000/api/places"
        self.preprocessor = Preprocessor()

    def load_data(self):
        """Fetches data from the API and computes sentiment scores."""
        try:
            response = requests.get(self.api_url)
            if response.status_code == 200:
                data = response.json()
                places = data.get("data", [])

                self.preprocessor.compute_sentiment_scores(places)

                return places
            else:
                print(f"Error: Failed to fetch data, status code {response.status_code}")
                return []
        except Exception as e:
            print(f"Error occurred: {e}")
            return []