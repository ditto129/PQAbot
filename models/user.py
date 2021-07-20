''' =========== USER_COLLECTION =========== *
- 新增資料 : insert_資料名稱
- 取得資料 : query_資料名稱
- 刪除資料 : remove_資料名稱
- 資料名稱統一，以底線分隔
- 使用collection : _db.IUSER_COLLECTION
* ========================================'''

from . import _db


# 新增 user
def insert_user(user_dict):
    _db.USER_COLLECTION.insert_one(user_dict)
    

# 查詢 user
def query_user(user_id):
    # 使用者發文紀錄/回覆紀錄更新
    post_record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'asker_id': user_id}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
    _db.USER_COLLECTION.update_one({'_id':user_id},{'$set':{'record.posts':post_record_list}})
        
    response_record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'answer.replier_id': user_id}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
    _db.USER_COLLECTION.update_one({'_id':user_id},{'$set':{'record.responses':response_record_list}})
    return _db.USER_COLLECTION.find_one({'_id':user_id})

# 編輯使用者資料
def update_user(update_dict):
    user_data = _db.USER_COLLECTION.find_one({'_id':update_dict['_id']})
    _db.USER_COLLECTION.update_one({'_id':update_dict['_id']},{'$set':update_dict})
    # 更改所有發過文的名字
    if len(update_dict['name']) != 0:
        for post in user_data['record']['posts']:
            _db.INNER_POST_COLLECTION.update_one({'_id':post['_id']},{'$set':{'asker_name':update_dict['name']}})
        # 更改所有回覆的名字
        for post in user_data['record']['response']:
            _db.INNER_POST_COLLECTION.update({'_id':post['_id']},
                                             {'$set':{'answer.$[elem].replier_name':update_dict['name']}},
                                             {'arrayFilters': [{ "elem.replier_id": update_dict['_id']}]},multi=True)

# 增加使用者特定tag一般積分
def update_user_score(user_id,tag_id,tag_name,score):
    # 若使用者沒有該技能，新增該技能
    if _db.USER_COLLECTION.find_one({'_id':user_id,'skill.tag_id': tag_id}) == None:
        tag_data = {
            'tag_id' : tag_id,
            'skill_name' : tag_name,
            'interested_score' : 0,
            'score' : score
        }
        _db.USER_COLLECTION.update_one({'_id':user_id},{'$push':{'skill':tag_data }})
    # 使用者持有該技能，技能積分增加
    else:
        _db.USER_COLLECTION.update_one({'_id':user_id,'skill.tag_id': tag_id},{'$inc':{'skill.$.score':score }})
        
# 增加使用者特定tag興趣積分    
def update_user_interested_score(user_id,tag_id,tag_name,score):
    # 若使用者沒有該技能，新增該技能
    if _db.USER_COLLECTION.find_one({'_id':user_id,'skill.tag_id': tag_id}) == None:
        tag_data = {
            'tag_id' : tag_id,
            'skill_name' : tag_name,
            'interested_score' : score,
            'score' : 0
        }
        _db.USER_COLLECTION.update_one({'_id':user_id},{'$push':{'skill':tag_data }})
    # 使用者持有該技能，技能積分增加
    else:
        _db.USER_COLLECTION.update_one({'_id':user_id,'skill.tag_id': tag_id},{'$set':{'skill.$.interested_score': score }})

# 更新使用者興趣
def update_user_interest(user_id,tag_list):
    for t in tag_list:
        update_user_interested_score(user_id,t["tag_id"],t["skill_name"],t["interested_score"])
        
    
    