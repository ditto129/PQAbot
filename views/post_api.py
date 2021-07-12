# --- flask --- #
from flask import Blueprint, request, jsonify
#from flask_security import logout_user, login_required

# --- google sign-in --- #
from google.oauth2 import id_token
from google.auth.transport import requests

# --- our models ---- #
from models import inner_post

post_api = Blueprint('post_api', __name__)

# 依照每頁筆數以及頁碼取得貼文摘要
@post_api.route('/query_inner_post_list', methods=['POST'])
def query_inner_post_list():
    data = request.get_json()
    post_list = inner_post.query_post_list(data['page_size'],data['page_number'])
    return jsonify(post_list),200

# 新增內部貼文
@post_api.route('/insert_inner_post', methods=['POST'])
def insert_inner_post():
    data = request.get_json()
    post_dict = {
        '_id' : '',
        'asker_id' : data['asker_id'],
        'asker_name' : data['asker_name'],
        'title' : data['title'],
        'question' : data['question'],
        'answer' : [],
        'keyword' : data['keyword'],
        'tag' : data['tag'],
        'time' : data['time'],
        'incognito' :data['incognito']
    }
    inner_post.insert_post(post_dict)
    return jsonify(post_dict),200

# 編輯內部貼文
@post_api.route('/update_inner_post', methods=['POST'])
def update_inner_post():
    data = request.get_json()
    inner_post.update_post(data)
    return jsonify(data),200

# 依貼文_id查看貼文
@post_api.route('/query_inner_post', methods=['POST'])
def query_inner_post():
    data = request.get_json()
    post_dict = inner_post.query_post(data['_id'])
    return jsonify(post_dict),200

# 新增貼文回覆
@post_api.route('/insert_inner_post_response',methods=['POST'])
def insert_inner_post_response():
    data = request.get_json()
    response_dict = {
        'post_id' : data['post_id'],
        '_id' : '',
        "replier_id" : data['replier_id'],
        "replier_name" : data['replier_name'],
        "response" : data['response'],
        "score" : data['score'],
        "time" : data['time']
    }
    inner_post.insert_response(response_dict)
    return response_dict,200

# 編輯貼文回覆
@post_api.route('/update_inner_post_response',methods=['POST'])
def update_inner_post_response():
    response_dict = request.get_json()
    inner_post.update_response(response_dict)
    return response_dict,200

# 對貼文按讚
@post_api.route('/like_inner_post',methods=['POST'])
def like_inner_post():
    data = request.get_json()
    score_dict = {
        'post_id' : data['post_id'],
        'response_id' : data['response_id'],
        'target_user':data['target_user'],
        'score' : 1,
    }
    inner_post.update_score(score_dict)
    return score_dict,200

# 對貼文按倒讚
@post_api.route('/dislike_inner_post',methods=['POST'])
def dislike_inner_post():
    data = request.get_json()
    score_dict = {
        'post_id' : data['post_id'],
        'response_id' : data['response_id'],
        'target_user':data['target_user'],
        'score' : -1,
    }
    inner_post.update_score(score_dict)
    return score_dict,200