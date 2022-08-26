from datetime import datetime, timezone, timedelta

from functools import wraps

from flask import request
from flask_restx import Api, Resource, fields

import jwt

from .models import db, Users, JWTTokenBlocklist
from .config import BaseConfig
from .wordcloud import GenerateWordCloud
from .recommendations import GenerateRecommendations

from elastic_enterprise_search import AppSearch

import h3
import json

import socket

import time

import redis
import os

#Twitter endpoint

db = redis.Redis(host='redis',port = 6379, decode_responses = True)

##


app_search = AppSearch("https://food.ent.us-central1.gcp.cloud.es.io", http_auth="private-ag8uv526f3arzdz774bzq3j2")

rest_api = Api(version="1.0", title="Users API")

generate_wordcloud_ob = GenerateWordCloud()
generate_recommendations_ob = GenerateRecommendations()


"""
    Flask-Restx models for api request and response data
"""

signup_model = rest_api.model('SignUpModel', {"username": fields.String(required=True, min_length=2, max_length=32),
                                              "email": fields.String(required=True, min_length=4, max_length=64),
                                              "password": fields.String(required=True, min_length=4, max_length=16)
                                              })

login_model = rest_api.model('LoginModel', {"email": fields.String(required=True, min_length=4, max_length=64),
                                            "password": fields.String(required=True, min_length=4, max_length=16)
                                            })

user_edit_model = rest_api.model('UserEditModel', {"userID": fields.String(required=True, min_length=1, max_length=32),
                                                   "username": fields.String(required=True, min_length=2, max_length=32),
                                                   "email": fields.String(required=True, min_length=4, max_length=64)
                                                   })


"""
   Helper function for JWT token required
"""

def token_required(f):

    @wraps(f)
    def decorator(*args, **kwargs):

        token = None

        if "authorization" in request.headers:
            token = request.headers["authorization"]

        if not token:
            return {"success": False, "msg": "Valid JWT token is missing"}, 400

        try:
            data = jwt.decode(token, BaseConfig.SECRET_KEY, algorithms=["HS256"])
            current_user = Users.get_by_email(data["email"])

            if not current_user:
                return {"success": False,
                        "msg": "Sorry. Wrong auth token. This user does not exist."}, 400

            token_expired = db.session.query(JWTTokenBlocklist.id).filter_by(jwt_token=token).scalar()

            if token_expired is not None:
                return {"success": False, "msg": "Token revoked."}, 400

            if not current_user.check_jwt_auth_active():
                return {"success": False, "msg": "Token expired."}, 400

        except:
            return {"success": False, "msg": "Token is invalid"}, 400

        return f(current_user, *args, **kwargs)

    return decorator


"""
    Flask-Restx routes
"""


@rest_api.route('/api/users/register')
class Register(Resource):
    """
       Creates a new user by taking 'signup_model' input
    """

    @rest_api.expect(signup_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _username = req_data.get("username")
        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)
        if user_exists:
            return {"success": False,
                    "msg": "Email already taken"}, 400

        new_user = Users(username=_username, email=_email)

        new_user.set_password(_password)
        new_user.save()

        return {"success": True,
                "userID": new_user.id,
                "msg": "The user was successfully registered"}, 200


@rest_api.route('/api/users/login')
class Login(Resource):
    """
       Login user by taking 'login_model' input and return JWT token
    """

    @rest_api.expect(login_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)

        if not user_exists:
            return {"success": False,
                    "msg": "This email does not exist."}, 400

        if not user_exists.check_password(_password):
            return {"success": False,
                    "msg": "Wrong credentials."}, 400

        # create access token uwing JWT
        token = jwt.encode({'email': _email, 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)

        user_exists.set_jwt_auth_active(True)
        user_exists.save()

        return {"success": True,
                "token": token,
                "user": user_exists.toJSON()}, 200


@rest_api.route('/api/users/edit')
class EditUser(Resource):
    """
       Edits User's username or password or both using 'user_edit_model' input
    """

    @rest_api.expect(user_edit_model)
    @token_required
    def post(self, current_user):

        req_data = request.get_json()

        _new_username = req_data.get("username")
        _new_email = req_data.get("email")

        if _new_username:
            self.update_username(_new_username)

        if _new_email:
            self.update_email(_new_email)

        self.save()

        return {"success": True}, 200


@rest_api.route('/api/users/logout')
class LogoutUser(Resource):
    """
       Logs out User using 'logout_model' input
    """

    @token_required
    def post(self, current_user):

        _jwt_token = request.headers["authorization"]

        jwt_block = JWTTokenBlocklist(jwt_token=_jwt_token, created_at=datetime.now(timezone.utc))
        jwt_block.save()

        self.set_jwt_auth_active(False)
        self.save()

        return {"success": True}, 200

@rest_api.route('/api/search')
class Search(Resource):
    """
    Searches for entities
    """

    # @token_required
    def get(self):
        args = request.args

        request_body = {
            'query': args.get("query"),
            'filters': {
                'city': [args.get('city')]
            },
            'page': {
                'size': 100
            }
        }
        ##Twitter Endpoints
        print("In Search api")
        searchKey = str(request_body['query'])
        print("search key", searchKey)
        if db.get(searchKey) == None:
           db.set("isKeyAvailable",searchKey)
           time.sleep(3)
           db.set("isKeyAvailable","None")
        #json_data = json.dumps(db.get(searchKey).split(' $$$ '))
        if db.get(searchKey) != None:
            Tweets = db.get(searchKey).split(' $$$ ')
        else:
            Tweets = []
        json_data = {"tweets":Tweets}
        print(json_data)



        ##
        results = app_search.search("meta-engine", body=request_body)
        entities = results['results']
        idsSet = set()
        for e in entities:
            idsSet.add(e['business_id']['raw'])

        ids = list(idsSet)
        if len(ids) == 0:
            return []
        # Get from documents
        docs = list(app_search.get_documents("business-data", ids))

        resolution = 10
        for doc in docs:
            latitude = float(doc['latitude'])
            longitude = float(doc['longitude'])
            hex_val = h3.geo_to_h3(latitude, longitude, resolution)
            doc['hex_val'] = hex_val
            if "hours" in doc.keys() and doc['hours'] is not None:
                b = json.loads(doc['hours'])
                for key in b:
                    processString = b[key]
                    timings = processString.split('-')
                    if len(timings) > 1:
                        timingsOne = timings[0].split(':')
                        if timingsOne[1] == '0':
                            timingsOne[1] = '00'
                        if int(timingsOne[0]) == 0:
                            finalAM = '12' +  ':' + timingsOne[1] + 'AM'
                        elif int(timingsOne[0]) == 12:
                            finalAM = '12' +  ':' + timingsOne[1] + 'PM'
                        elif int(timingsOne[0]) > 0 and int(timingsOne[0]) < 12:
                            finalAM = str(int(timingsOne[0])) +  ':' + timingsOne[1] + 'AM'
                        elif int(timingsOne[0]) > 12 and int(timingsOne[0]) < 24:
                            finalAM = str(int(timingsOne[0])-12) +  ':' + timingsOne[1] + 'PM'
                        timingsTwo = timings[1].split(':')
                        if timingsTwo[1] == '0':
                            timingsTwo[1] = '00'
                        if int(timingsTwo[0]) == 0:
                            finalPM = '12' +  ':' + timingsTwo[1] + 'AM'
                        elif int(timingsTwo[0]) == 12:
                            finalPM = '12' +  ':' + timingsTwo[1] + 'PM'
                        elif int(timingsTwo[0]) > 0 and int(timingsTwo[0]) < 12:
                            finalPM = str(int(timingsTwo[0])) +  ':' + timingsTwo[1] + 'AM'
                        elif int(timingsTwo[0]) > 12 and int(timingsTwo[0]) < 24:
                            finalPM = str(int(timingsTwo[0])-12) +  ':' + timingsTwo[1] + 'PM'
                        b[key] = finalAM + '-' +  finalPM
                doc['hours'] = json.dumps(b)
        print(type(docs))
        docs.append(json_data)
        #dict = json.loads(docs)
        #dict["tweets"] = Tweets
        #docs = json.dumps(dict)
        #print(docs)

        return docs

@rest_api.route('/api/review')
class Review(Resource):
    """
    Searches for entities
    """

    # @token_required
    def get(self):
        args = request.args
        business_id = args.get('business_id')
        request_body = {
            'query': '',
            'filters': {
                'business_id': [args.get('business_id')]
            },
            'page': {
                'size': 3
            }
        }
        results = app_search.search("reviews-data", body=request_body)
        entities = results['results']
        b64_string_image = GenerateWordCloud.generate_image(generate_wordcloud_ob,entities)
        wordcloud = {
            'b64_string_image': b64_string_image
        }
        entities.append(wordcloud)
        recommendations = GenerateRecommendations.generate_recommendations(generate_recommendations_ob, business_id)
        recommendation_json = {
            'recommendation': recommendations
        }
        entities.append(recommendation_json)
        # Get from documents
        #docs = app_search.get_documents("business-data", ids)
        request_body1 = {
            'query': '',
            'filters': {
                'business_id': [args.get('business_id')]
            }
        }
        resultsPhotos = app_search.search("photos-data", body=request_body1)
        photos = resultsPhotos['results']
        photo_ids_set = set()
        for photo in photos:
            if "photo_id" in photo.keys() and photo['photo_id'] is not None and "raw" in photo['photo_id'].keys() and photo['photo_id']['raw'] is not None: 
                photo_ids_set.add(photo['photo_id']['raw'])
        photo_ids_dict= {
            'photo_ids': list(photo_ids_set)
        }
        entities.append(photo_ids_dict)
        return entities

@rest_api.route('/api/QuerySuggestion')
class QuerySuggestion(Resource):
    """
    TypeAhead
    """
    #Not working with request body

    '''
    #Query suggestion
    client.query_suggestion('favorite-videos', 'cat', {
    'size': 10,
    'types': {
     'documents': {
          'fields': ['title']
        }
     }
    })
    '''

    # @token_required
    def get(self):
        args = request.args
        request_body = {
            "size": 10,
            "types": {
            "documents": {
                "fields": ['text', 'name', 'categories']
                }
            }
        }

        results = app_search.query_suggestion("meta-test-city", args.get('query_param'))
        entities = results['results']

        return entities

