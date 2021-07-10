
# --- flask --- #
from flask import Blueprint, request, jsonify
# from flask_security import logout_user, login_required


# --- our models ---- #
from models import user
#from models.psa_excption_handler import err_msg

user_api = Blueprint("user_api", __name__)

# 取得使用者簡易資料，不包含技能樹、發文紀錄
@user_api.route('/get_user_profile', methods=['POST'])
def get_user_profile():
    data = request.get_json()
    user_dict = user.query_user(data['id'])
    try:
        user_profile = {
            '_id' : user_dict['id'],
            'name': user_dict['name'],
            'email':user_dict['email'],
            'exp' : user_dict['exp']
        }
    except Exception as e:
        user_profile = {"error" : err_msg(e)}
    jsonify(user_profile),200


# 取得使用者發文紀錄
@user_api.route('/get_user_post_list', methods=['POST'])
def get_user_post_list():
    data = request.get_json()
    user_dict = user.query_user(data['id'])
    try:
        user_posts = user_dict['record']['posts']
    except Exception as e:
        user_posts = {"error" : err_msg(e)}
    jsonify(user_posts),200
    
# 取得使用者回覆紀錄
@user_api.route('/get_user_response_list', methods=['POST'])
def get_user_response_list():
    data = request.get_json()
    user_dict = user.query_user(data['id'])
    try:
        user_posts = user_dict['record']['responses']
    except Exception as e:
        user_posts = {"error" : err_msg(e)}
    jsonify(user_posts),200

# 取得使用者技能樹
@user_api.route('/get_user_skill', methods=['POST'])
def get_user_skill():
    data = request.get_json()
    user_dict = user.query_user(data['id'])
    try:
        user_skill = user_dict['skill']
    except Exception as e:
        user_skill = {"error" : err_msg(e)}
    jsonify(user_skill),200
