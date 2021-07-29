''' =========== FAQ_DATA_COLLECTION =========== *
- 新增資料 : insert_資料名稱
- 取得資料 : query_資料名稱
- 刪除資料 : remove_資料名稱
- 資料名稱統一，以底線分隔
- 使用collection : _db.FAQ_DATA_COLLECTION
* ========================================'''

from . import _db
import re
from datetime import datetime
# 調整更新週期
def adjust_update_cycle(data_number,update_cycle):
    _db.FAQ_DATA_COLLECTION.update_one({'_id':'faq_settings'},{'$set':{'data_number':data_number,'update_cycle':update_cycle}})

# 取得更新週期
def query_update_cycle():
    return _db.FAQ_DATA_COLLECTION.find_one({'_id':'faq_settings'})

# 取得FAQ列表
def query_list(page_size,page_number,option):
    faq_count = [i for i in _db.FAQ_DATA_COLLECTION.aggregate([{'$skip': 1},
                                                               {'$count': 'faq_count'}])][0]['faq_count']
    if option == '': # 預設是用時間排
        faq_list = [ doc for doc in _db.FAQ_DATA_COLLECTION.aggregate([{'$skip': 1},
                                                                       {'$project': {'_id': 1, 'question.title': 1, 'time': 1, 'keywords': 1,'tags': 1, 'score': {'$sum': '$score.score'}, 'view_count': 1}}, 
                                                                       {'$sort': {'time': -1}}, 
                                                                       {'$skip': page_size * (page_number - 1)}, 
                                                                       {'$limit': page_size}])]
    else : 
        faq_list = [ doc for doc in _db.FAQ_DATA_COLLECTION.aggregate([{'$skip': 1},
                                                                       {'$project': {'_id': 1, 'question.title': 1, 'time': 1, 'keywords': 1,'tags': 1, 'score': {'$sum': '$score.score'}, 'view_count': 1}}, 
                                                                       {'$sort': {option: -1}}, 
                                                                       {'$skip': page_size * (page_number - 1)}, 
                                                                       {'$limit': page_size}])]
    return {'faq_count' : faq_count,'faq_list' : faq_list}
# 依標籤取得FAQ列表
def query_list_by_tag(tag_list,page_size,page_number,option):
    faq_count = len([i for i in _db.FAQ_DATA_COLLECTION.aggregate([{'$skip': 1},
                                                                   {'$project': {'hastag': {'$setIsSubset': [tag_list, '$tags']}}}, 
                                                                   {'$match': {'hastag': True}}])])
    if option == '': # 預設是用時間排
        faq_list = [ doc for doc in _db.FAQ_DATA_COLLECTION.aggregate([{'$skip': 1}, 
                                                                       {'$project': {'_id': 1, 'question.title': 1, 'time': 1, 'keywords':1, 'tags': 1, 'score': {'$sum': '$score.score'}, 'view_count': 1, 'hastag': {'$setIsSubset': [tag_list, '$tags']}}}, 
                                                                       {'$sort': {'time': -1}}, 
                                                                       {'$skip': page_size * (page_number - 1)}, 
                                                                       {'$limit': page_size}])]
    else : 
        faq_list = [ doc for doc in _db.FAQ_DATA_COLLECTION.aggregate([{'$skip': 1}, 
                                                                       {'$project': {'_id': 1, 'question.title': 1, 'time': 1, 'keywords':1, 'tags': 1, 'score': {'$sum': '$score.score'}, 'view_count': 1, 'hastag': {'$setIsSubset': [tag_list, '$tags']}}}, 
                                                                       {'$sort': {option : -1}}, 
                                                                       {'$skip': page_size * (page_number - 1)}, 
                                                                       {'$limit': page_size}])]
    return {'faq_count' : faq_count,'faq_list' : faq_list}
# 依字串取得FAQ列表
def query_list_by_string(search_string,page_size,page_number,option):
    # 用空白切割字串
    search_list = re.split(r'[ ]', search_string)       
    # 標題搜尋                                        
    regex_list = [{'question.title':{'$regex':'|'.join(search_list), '$options':'i'}}]
    # 關鍵字,tag搜尋
    for token in search_list:                                                                   
        regex_list.append({'keywords':{'$regex':token, '$options':'i'}})
        regex_list.append({'tags.tag_name':{'$regex':token, '$options':'i'}})
    faq_count = len([ i for i in _db.FAQ_DATA_COLLECTION.aggregate([{'$match': {'$or': regex_list}}])])
    if option == '': 
        faq_list = [ doc for doc in _db.FAQ_DATA_COLLECTION.aggregate([{'$skip': 1}, 
                                                                       {'$match': {'$or': regex_list}},
                                                                       {'$project': {'_id': 1, 'question.title': 1, 'time': 1, 'keywords':1, 'tags': 1, 'score': {'$sum': '$score.score'}, 'view_count': 1}}, 
                                                                       {'$sort': {'time': -1}}, 
                                                                       {'$skip': page_size * (page_number - 1)}, 
                                                                       {'$limit': page_size}])]
    else :
        faq_list = [ doc for doc in _db.FAQ_DATA_COLLECTION.aggregate([{'$skip': 1}, 
                                                                       {'$match': {'$or': regex_list}},
                                                                       {'$project': {'_id': 1, 'question.title': 1, 'time': 1, 'keywords':1, 'tags': 1, 'score': {'$sum': '$score.score'}, 'view_count': 1}}, 
                                                                       {'$sort': {option: -1}}, 
                                                                       {'$skip': page_size * (page_number - 1)}, 
                                                                       {'$limit': page_size}])]
    return {'faq_count' : faq_count,'faq_list' : faq_list} 
# 新增單篇FAQ
def insert_faq(data_dict,data_type):
    all_faq = _db.FAQ_DATA_COLLECTION.find().skip(1)
    if len(all_faq) == 0:
        data_dict['_id'] = '000001'
    else:
        # sort _id,將最大的+1當作新的_id
        biggest_id = int(all_faq.skip(1).sort('_id',-1).limit(1)[0]['_id'])
        data_dict['_id'] = str(biggest_id + 1).zfill(6)
    # 管理員新增faq處理answer_id和資料庫tag
    if data_type == 'inner_faq':
        answer_id = 0
        for ans in data_dict['answers']:
            ans['id'] = str(answer_id + 1).zfill(6)
            answer_id += 1
        # 如果有tag，更新tag的紀錄
        if len(data_dict['tags']) != 0:
            for tag in data_dict['tags']:
                target_tag = _db.TAG_COLLECTION.find_one({'_id':tag['tag_id']})
            _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},{'$set':{'recent_use':data_dict['time'],
                                                                         'usage_counter':target_tag['usage_counter'] + 1}})
    # FAQ加入資料庫
    _db.FAQ_DATA_COLLECTION.insert_one(data_dict)
# 匯入FAQ
def import_faq(data_list,data_type):
    all_faq = _db.FAQ_DATA_COLLECTION.find().skip(1)
    if len(all_faq) == 0:
        current_id = '000000'
    else:
        # sort _id,將最大的+1當作新的_id
        biggest_id = int(all_faq.skip(1).sort('_id',-1).limit(1)[0]['_id'])
        current_id = str(biggest_id + 1).zfill(6)
    for data_dict in data_list:  
        data_dict['_id'] = str(int(current_id) + 1).zfill(6)
        # 處理內部內部貼文 answer_id,tag
        if data_type == 'inner_faq':
            answer_id = 0
            for ans in data_dict['answers']:
                ans['id'] = str(answer_id + 1).zfill(6)
                answer_id += 1
            # 如果有tag，更新tag的紀錄
            if len(data_dict['tags']) != 0:
                for tag in data_dict['tags']:
                    target_tag = _db.TAG_COLLECTION.find_one({'_id':tag['tag_id']})
                _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},{'$set':{'recent_use':data_dict['time'],
                                                                             'usage_counter':target_tag['usage_counter'] + 1}})
    # 加入多筆資料
    _db.FAQ_DATA_COLLECTION.insert_many(data_list)
    
# 查看單篇FAQ
def query_faq_post(faq_id):
    return _db.FAQ_DATA_COLLECTION.find_one(faq_id)

# 將爬蟲資料轉成FAQ格式
def transform_faq(faq_list):
    transformed_list = [
        {
            "_id" : "",          
            "link" : faq['link'],         
            "question" : 
            {
                "id" : faq['question']['id'],       
                "title" : faq['question']['title'],    
                "content" : faq['question']['content'],   
                "vote" : faq['question']['vote'],      
                "score" : []
            },
            "answers" : 
            [
                {       
                    "_id" : ans['id'],       
                    "content" : ans['content'],
                    "vote" : ans['vote'],     
                    "score" : [],
                } for ans in faq['answers']
            ],
            "keywords" : faq['kewords'],     
            "tags" : [],
            "time" : datetime.now().replace(microsecond=0).isoformat(),
            "view_count" : 0
        } for faq in faq_list
    ]
    import_faq(transformed_list,'outer_faq')