# --- flask --- #
from flask import Blueprint, request, jsonify
#from flask_security import logout_user, login_required

# --- google sign-in --- #
from google.oauth2 import id_token
from google.auth.transport import requests

# --- our models ---- #
from models import user

login_api = Blueprint("login_api", __name__)
GOOGLE_OAUTH2_CLIENT_ID = '417777300686-b6isl0oe0orcju7p5u0cpdeo07hja9qs.apps.googleusercontent.com'

@login_api.route('/google_sign_in', methods=['POST'])
def google_sign_in():
    token = request.json['id_token']

    try:
        # Specify the GOOGLE_OAUTH2_CLIENT_ID of the app that accesses the backend:
        id_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_OAUTH2_CLIENT_ID
        )
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
            
    except ValueError:
        # Invalid token
        raise ValueError('Invalid token')
    # 取得使用者資料，若使用者不存在就建立一份
    user_dict = user.query_user(id_info['sub'])
    if user_dict == None:
        user_dict = {
            "_id" : id_info['sub'],
            "name" : id_info['name'],
            "email" : id_info['email'],
            "skill" : [],
            "record" : {
                "posts" : [],
                "responses" : []
            },
            "notification":[]
        }
        user.insert_user(user_dict)
        user_dict = user.query_user(id_info['sub'])
    return jsonify(user_dict)

@login_api.route('/facebook_sign_in', methods=['POST'])
def facebook_sign_in():
    data = request.get_json()
    user_dict = user.query_user(data['id'])
    # 取得使用者資料，若使用者不存在就建立一份
    if user_dict == None:
        user_dict = {
            "_id" : data['id'],
            "name" : data['name'],
            "email" : data['email'],
            "skill" : [],
            "record" : {
                "posts" : [],
                "responses" : []
            },
            "notification":[]
        }
        user.insert_user(user_dict)
        user_dict = user.query_user(data['id'])
    return jsonify(user_dict)