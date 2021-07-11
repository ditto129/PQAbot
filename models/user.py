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
    return _db.USER_COLLECTION.find_one({'_id':user_id})

# 編輯使用者資料
def update_user(user_dict):
    _db.USER_COLLECTION.update_one({'_id':user_dict['_id']},{'$set':user_dict})
    
# 調整使用者特定tag一般積分
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