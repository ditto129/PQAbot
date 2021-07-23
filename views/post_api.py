# --- flask --- #
from flask import Blueprint, request, jsonify
#from flask_security import logout_user, login_required

# --- our models ---- #
from models import inner_post
from datetime import datetime

post_api = Blueprint('post_api', __name__)

# 依照每頁筆數,頁碼取得貼文摘要
@post_api.route('/query_inner_post_list', methods=['POST'])
def query_inner_post_list():
    data = request.get_json()
    try: 
        list_dict = inner_post.query_post_list(data['page_size'],data['page_number'],data['option'])
        
    except Exception as e :
        list_dict = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(list_dict)

# 依照貼文標題,每頁筆數,頁碼取得貼文摘要
@post_api.route('/query_inner_post_list_by_title', methods=['POST'])
def query_inner_post_list_by_title():
    data = request.get_json()
    try:
        list_dict = inner_post.query_post_list_by_title(data['title'],data['page_size'],data['page_number'],data['option'])
    except Exception as e :
        list_dict = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(list_dict)

# 依照標籤,每頁筆數,頁碼取得貼文摘要
@post_api.route('/query_inner_post_list_by_tag', methods=['POST'])
def query_inner_post_list_by_tag():
    data = request.get_json()
    try:
        list_dict = inner_post.query_post_list_by_tag(data['tag'],data['page_size'],data['page_number'],data['option'])
    except Exception as e :
        list_dict = {"error" : e.__class__.__name__ + " : " +e.args[0]}
    return jsonify(list_dict)

# 新增內部貼文
@post_api.route('/insert_inner_post', methods=['POST'])
def insert_inner_post():
    data = request.get_json()
    try:
        post_dict = {
            '_id' : '',
            'asker_id' : data['asker_id'],
            'asker_name' : data['asker_name'],
            'title' : data['title'],
            'question' : data['question'],
            'answer' : [],
            'keyword' : [],
            'tag' : data['tag'],
            'time' : datetime.fromisoformat(data['time']),
            'incognito' :data['incognito'],
            'score' : [],
            'view_count' : 0
        }
        inner_post.insert_post(post_dict)
    except Exception as e :
        post_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
    return jsonify(post_dict)

# 編輯內部貼文
@post_api.route('/update_inner_post', methods=['POST'])
def update_inner_post():
    data = request.get_json()
    try:
        post_dict = {
            '_id' : data['_id'],
            'asker_id':data['asker_id'],
            'title' : data['title'],
            'question' : data['question'],
            'time' : datetime.fromisoformat(data['time'])
        }
        inner_post.update_post(post_dict)
    except Exception as e :
        post_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
    return jsonify(post_dict)

# 依貼文_id查看貼文
@post_api.route('/query_inner_post', methods=['POST'])
def query_inner_post():
    data = request.get_json()
    try:
        post_dict = inner_post.query_post(data['_id'])
    except Exception as e :
        post_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
    return jsonify(post_dict)

# 新增貼文回覆
@post_api.route('/insert_inner_post_response',methods=['POST'])
def insert_inner_post_response():
    data = request.get_json()
    try:
        response_dict = {
            'post_id' : data['post_id'],
            '_id' : '',
            "replier_id" : data['replier_id'],
            "replier_name" : data['replier_name'],
            "response" : data['response'],
            "time" : datetime.fromisoformat(data['time']),
            "score":[],
            "incognito":data['incognito']
        }
        inner_post.insert_response(response_dict)
    except Exception as e :
        response_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
    return jsonify(response_dict)

# 編輯貼文回覆
@post_api.route('/update_inner_post_response',methods=['POST'])
def update_inner_post_response():
    data = request.get_json()
    try:
        response_dict = {
            'post_id' : data['post_id'],
            '_id' : data['_id'],
            "replier_id" : data['replier_id'],
            "response" : data['response'],
            "time" : datetime.fromisoformat(data['time'])
        }
        inner_post.update_response(response_dict)
    except Exception as e :
        response_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}  
    return jsonify(response_dict)

# 對貼文按讚
@post_api.route('/like_inner_post',methods=['POST'])
def like_inner_post():
    data = request.get_json()
    try:
        score_dict = {
            'post_id' : data['post_id'],
            'response_id' : data['response_id'],
            'user':data['user'],
            'score' : 1,
        }
        inner_post.update_score(score_dict)
    except Exception as e :
        score_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
    return jsonify(score_dict)

# 對貼文按倒讚
@post_api.route('/dislike_inner_post',methods=['POST'])
def dislike_inner_post():
    data = request.get_json()
    try:
        score_dict = {
            'post_id' : data['post_id'],
            'response_id' : data['response_id'],
            'user':data['user'],
            'score' : -1,
        }
        inner_post.update_score(score_dict)
    except Exception as e :
        score_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
    return jsonify(score_dict)

# 刪除貼文
@post_api.route('/delete_inner_post',methods=['POST'])
def delete_inner_post():
    data = request.get_json()
    try: 
        inner_post.remove_post(data['_id'])
    except Exception as e :
        data = {"error" : e.__class__.__name__ + ":" +e.args[0]}
        print(e)
    return jsonify(data)
    
#內部搜尋
@post_api.route('query_inner_search', methods=['POST'])
def query_inner_search():
    data = request.get_json()
    print("keyword陣列:")
    print(data['keywords'])
    #try:
    inner_search_result=inner_post.query_inner_search(data['keywords'])
    inner_search_result_dict = {
        'inner_search_result': inner_search_result
    }
#    except Exception as e :
#        inner_search_result_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
#        print(e)
    return jsonify(inner_search_result_dict)
