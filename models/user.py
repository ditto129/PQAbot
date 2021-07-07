''' ============= 命名規則 =============== *
- 新增資料: insert_資料名稱
- 取得資料: query_資料名稱
- 刪除資料: remove_資料名稱
- 資料名稱統一，以底線分隔
* ========================================'''

from . import _db

#新增 user
def insert_user(user_dict):
    _db.USER_COLLECTION.insert_one(user_dict)
    
#查詢 user
def query_user(user_id):
    return _db.USER_COLLECTION.find_one({'userID':user_id})


