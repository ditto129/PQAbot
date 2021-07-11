
# --- flask --- #
from flask import Blueprint, request, jsonify
# from flask_security import logout_user, login_required


# --- our models ---- #
from models import user
# rom models import psa_excption_handler


user_api = Blueprint("user_api", __name__)

# 取得使用者簡易資料，不包含技能樹、發文紀錄
@user_api.route('/query_user_profile', methods=['POST'])
def query_user_profile():
    data = request.query_json()
    user_dict = user.query_user(data['id'])
    try:
        user_profile = {
            '_id' : user_dict['id'],
            'name': user_dict['name'],
            'email':user_dict['email'],
            'img': user_dict['img']
        }
    except Exception as e :
        user_profile = {"error" : e.__class__.__name__ + e.args[0]}
        print(e)
    return jsonify(user_profile),200


# 取得使用者發文紀錄
@user_api.route('/query_user_post_list', methods=['POST'])
def query_user_post_list():
    data = request.query_json()
    user_dict = user.query_user(data['id'])
    try:
        user_posts = user_dict['record']['posts']
    except Exception as e :
        user_posts = {"error" : e.__class__.__name__ + e.args[0]}
        print(e)
    return jsonify(user_posts),200
    
# 取得使用者回覆紀錄
@user_api.route('/query_user_response_list', methods=['POST'])
def query_user_response_list():
    data = request.query_json()
    user_dict = user.query_user(data['id'])
    try:
        user_posts = user_dict['record']['responses']
    except Exception as e :
        user_posts = {"error" : e.__class__.__name__ + e.args[0]}
        print(e)
    return jsonify(user_posts),200

# 取得使用者技能樹
@user_api.route('/query_user_skill', methods=['POST'])
def query_user_skill():
    data = request.query_json()
    user_dict = user.query_user(data['id'])
    try:
        user_skill = user_dict['skill']
    except Exception as e :
        user_skill = {"error" : e.__class__.__name__ + e.args[0]}
        print(e)
    return jsonify(user_skill),200
    
# 編輯使用者簡易資料，不包含技能樹、發文紀錄
@user_api.route('/update_user_profile', methods=['POST'])
def update_user_profile():
    data = request.query_json()
    try:
        user_profile = {
            '_id' : data['id'],
            'name': data['name'],
            'email':data['email'],
            'img': data['img']
        }
        user.update_user(user_profile)
    except Exception as e :
        user_profile = {"error" : e.__class__.__name__ + e.args[0]}
        print(e)
    return jsonify(user_profile),200
    

