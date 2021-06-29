# --- flask --- #
from flask import Blueprint, request, jsonify
#from flask_security import logout_user, login_required

# --- google sign-in --- #
from google.oauth2 import id_token
from google.auth.transport import requests

# --- our models ---- #
from models import user

login_api = Blueprint("login_api", __name__)
GOOGLE_OAUTH2_CLIENT_ID = '417777300686-0vp7be6826583nc16qjiqkfusp39hjrh.apps.googleusercontent.com'

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
    user_dict = user.get_user_profile(id_info['sub'])
    if user_dict == None:
        user_dict = {
            "userID" : id_info['sub'],
            "name" : id_info['name'],
            "exp" : 0,
            "skill" : [],
            "record" : {
                "posts" : [],
                "responses" : []
            }
        }
        user.insert_user_profile(user_dict)
        user_dict = user.get_user_profile(id_info['sub'])
    user_dict['_id'] = str(user_dict['_id']) 
    print(user_dict)
    return jsonify(user_dict),200

@login_api.route('/facebook_sign_in', methods=['POST'])
def facebook_sign_in():
    data = request.get_json()
    user_dict = user.get_user_profile(data['id'])
    # 取得使用者資料，若使用者不存在就建立一份
    if user_dict == None:
        user_dict = {
            "userID" : data['id'],
            "name" : data['name'],
            "exp" : 0,
            "skill" : [],
            "record" : {
                "posts" : [],
                "responses" : []
            }
        }
        user.insert_user_profile(user_dict)
        user_dict = user.get_user_profile(data['id'])
    user_dict['_id'] = str(user_dict['_id']) 
    print(user_dict)
    return jsonify(user_dict),200
