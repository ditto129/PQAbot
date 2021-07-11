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
        # ---------------------- 另一種寫法 ---------------------- #
        # 將recent_use設為貼文時間
        # _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},{'$set':{'recent_use':post_dict['time']}})
        # 將usage_counter + 1
        # _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},{'$inc':{'usage_counter':1}})
        # -------------------------------------------------------- #
        
        # 使用者相關標籤積分 + 2
        user.update_user_score(post_dict['asker_id'],tag['tag_id'],tag['tag_name'],2)
        
        
# 編輯一筆貼文內容
def update_post(post_data):
    _db.INNER_POST_COLLECTION.update_one(post_data['_id'],{'$set':post_data})

# 刪除某一筆貼文
def remove_post(post_id):
    return ""

# 取得所有貼文列表
def query_post_list(page_size,page_number):
    return [{'_id' : doc['post_id'],
             'tittle': doc['title'],
             'time' : doc['time'],
             'tag' : doc['tag'],
             'score' : doc['score']} 
            for doc in _db.INNER_POST_COLLECTION.find().skip(page_size * (page_number - 1)).limit(page_size)]

    