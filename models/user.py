from . import _db



    
def insert_user_profile(user_dict):
    _db.USER_COLLECTION.insert_one(user_dict)
    
def get_user_profile(user_id):
    item = _db.USER_COLLECTION.find_one({'userID' : user_id})
    return item


