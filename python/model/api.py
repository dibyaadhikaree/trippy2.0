from flask import Flask, jsonify, request
from model.recommender import Recommender
from marshmallow import Schema, fields, ValidationError

app = Flask(__name__)

recommender = Recommender()

class RecommendRequestSchema(Schema):
    place_id = fields.String(required=False)
    user_preferences = fields.List(fields.String(), required=False)
    top_n = fields.Integer(missing=5)

recommend_schema = RecommendRequestSchema()

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = recommend_schema.load(request.get_json())

        place_id = data.get('place_id')
        user_preferences = data.get('user_preferences', [])
        top_n = data.get('top_n' , 7)

        if place_id:
            recommendations = recommender.recommend_places_by_id(place_id, top_n)
        elif user_preferences:
            recommendations = recommender.recommend_places_by_user_preferences(user_preferences, top_n)
        else:
            return jsonify({'error': 'Either place_id or user_preferences is required'}), 400

        return jsonify({'recommendations': recommendations})

    except ValidationError as err:
        return jsonify({'error': err.messages}), 400

@app.route('/popular', methods=['GET'])
def popular_places():
    top_n = int(request.args.get('top_n', 5))
    popular_places = recommender.get_popular_places(top_n)
    return jsonify({'popular_places': popular_places})

@app.route('/refresh', methods=['POST'])
def refresh():
    try:
        recommender.refresh_data()
        return jsonify({'message': 'Data refreshed successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to refresh data: {str(e)}'}), 500