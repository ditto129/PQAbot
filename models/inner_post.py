''' ======== INNER_POST_COLLECTION ======== *
- 新增資料 : insert_資料名稱
- 取得資料 : query_資料名稱
- 編輯資料 : update_資料名稱
- 刪除資料 : remove_資料名稱
- 資料名稱統一，以底線分隔，function前加上註解
- 使用collection : _db.INNER_POST_COLLECTION
* ========================================'''


from . import _db
from . import user

# 新增一筆貼文
def insert_post(post_dict):
    all_post = _db.TAG_COLLECTION.find()
    if all_post.count() == 0 : 
        # 處理第一篇貼文編號
        post_dict['_id'] = '000001'
    else:
        # sort post_id,將最大的+1當作新的post_id
        biggest_post_id = int(all_post.limit(1).sort('_id',-1)[0]['_id'])
        post_dict['_id'] = str(biggest_post_id + 1).zfill(6)
        
    # 將貼文新增至資料庫
    _db.INNER_POST_COLLECTION.insert_one(post_dict)
    # 更新使用者發文紀錄
    _db.USER_COLLECTION.update_one({'_id':post_dict['asker_id']},{'$push':{'record.posts':post_dict}})
    # 更新每個tag 的 usage_counter,recent_use
    for tag in post_dict['tag']:
        target_tag = _db.TAG_COLLECTION.find_one({'_id':tag['tag_id']})
        new_data = {
            "recent_use": post_dict['time'],
            "usage_counter":target_tag['usage_counter'] + 1
        }
        _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},{'$set':new_data})
        # 使用者相關標籤積分 + 2
        user.update_user_score(post_dict['asker_id'],tag['tag_id'],tag['tag_name'],2)
        
        
# 編輯一筆貼文內容
def update_post(post_data):
    _db.INNER_POST_COLLECTION.update_one({'_id': post_data['_id']},{'$set':post_data})

# 取得所有貼文列表
def query_post_list(page_size,page_number):
    return [{'_id' : doc['post_id'],
             'tittle': doc['title'],
             'time' : doc['time'],
             'tag' : doc['tag'],
             'score' : doc['score']} 
            for doc in _db.INNER_POST_COLLECTION.find().skip(page_size * (page_number - 1)).limit(page_size)]

# 依post_id取得特定貼文
def query_post(post_id):
    return _db.INNER_POST_COLLECTION.find_one({'_id':post_id})

# 新增貼文回覆
def insert_response(response_dict):
    target_post = _db.INNER_POST_COLLECTION.find_one({'_id':response_dict['post_id']})
    if len(target_post['answer']) == 0 : 
        # 處理第一篇回覆編號
        response_dict['_id'] = '000001'
    else:
        # sort response_id,將最大的+1當作新的response_id
        biggest_response_id = int(sorted(target_post['answer'], key = lambda k: k['_id'],reverse=True)[0]['_id'])
        response_dict['_id'] = str(biggest_response_id + 1).zfill(6)
    # 新增到answer
    response_dict.pop('post_id')
    _db.INNER_POST_COLLECTION.update_one({'_id':response_dict['post_id']},{'$push':{'answer':response_dict}})
    # 更新使用者回覆紀錄
    post_dict = {
        '_id' : target_post['_id'],
        'tittle': target_post['title'],
        'time' : target_post['time'],
        'tag' : target_post['tag'],
        'score' : target_post['score']
        }
    _db.USER_COLLECTION.update_one({'_id':response_dict['replier_id']},{'$push':{'record.responses':post_dict}})
    # 更新每個tag 的 usage_counter,recent_use
    for tag in target_post['tag']:
        target_tag = _db.TAG_COLLECTION.find_one({'_id':tag['tag_id']})
        new_data = {
            "recent_use": response_dict['time'],
            "usage_counter":target_tag['usage_counter'] + 1
        }
        _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},{'$set':new_data})
        # 使用者相關標籤積分 + 1
        user.update_user_score(response_dict['replier_id'],tag['tag_id'],tag['tag_name'], 1)
    
    
# 編輯貼文回覆
def update_response(response_dict):
    post_id = response_dict.pop('post_id')
    _db.INNER_POST_COLLECTION.update_one({'_id':post_id,'answer._id':response_dict['_id']},{'$set':{'answer.$':response_dict}})

# 編輯貼文評分
def update_score(score_dict):
    # response_id為空表示更新貼文評分
    if len(score_dict['response_id']) == 0 :
        _db.INNER_POST_COLLECTION.update_one({'_id':score_dict['post_id']},{'$inc':{'score':score_dict['score']}})
    # response_id不為空表示更新回覆評分
    else :
        _db.INNER_POST_COLLECTION.update_one({'_id':score_dict['post_id'],'answer._id':score_dict['response_id']},{'$inc':{'answer.$.score':score_dict['score']}})
    # 更新使用者相關技能積分
    tags = _db.INNER_POST_COLLECTION.find_one({'_id':score_dict['post_id']})['tag']
    for tag in tags:
        # 使用者相關標籤積分 + 1
        user.update_user_score(score_dict['target_user'],tag['tag_id'],tag['tag_name'], 1)