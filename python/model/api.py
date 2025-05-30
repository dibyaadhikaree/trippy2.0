from flask import Flask, jsonify, request
from marshmallow import Schema, fields, ValidationError
from .recommender import Recommender
from .popularity import Popularity
from .refresher import Refresher

app = Flask(__name__)

recommender = Recommender()
popularity = Popularity()
refresher = Refresher()

class RecommendSchema(Schema):
    _id = fields.String(required=True)
    top_n = fields.Int(missing=10)

class RefreshSchema(Schema):
    users = fields.Bool(missing=False)
    places = fields.Bool(missing=False)
    reviews = fields.Bool(missing=False)

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    try:
        data = RecommendSchema().load(request.get_json())
        recs = recommender.recommend(data['_id'], data['top_n'])
        return jsonify({'recommendations': recs})
    except ValidationError as e:
        return jsonify({'error': e.messages}), 400

@app.route('/popular', methods=['GET'])
def get_popular():
    top_n = int(request.args.get('top_n', 10))
    return jsonify({'popular': popularity.calculate(top_n)})

@app.route('/refresh', methods=['POST'])
def refresh_data():
    try:
        data = RefreshSchema().load(request.get_json())
        success = refresher.refresh(
            data['users'],
            data['places'],
            data['reviews']
        )
        return jsonify({'status': 'success' if success else 'failed'})
    except ValidationError as e:
        return jsonify({'error': e.messages}), 400