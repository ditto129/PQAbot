''' ======== INNER_POST_COLLECTION ======== *
- 新增資料 : insert_資料名稱
- 取得資料 : query_資料名稱
- 編輯資料 : update_資料名稱
- 刪除資料 : remove_資料名稱
- 資料名稱統一，以底線分隔，function前加上註解
- 使用collection : _db.INNER_POST_COLLECTION
* ========================================'''
# ====== our models ===== #
from . import _db
from . import user
# ======================= #

# 取得所有貼文列表
def query_post_list(page_size,page_number,option):
    if option == 'score': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}, 
                                                                 {'$sort': {'score': -1}}, 
                                                                 {'$skip': page_size * (page_number - 1)}, 
                                                                 {'$limit': page_size}])]
        post_count = [i for i in _db.INNER_POST_COLLECTION.aggregate([{'$count': 'post_count'}])][0]['post_count']
    elif option == 'view_count': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}, 
                                                                 {'$sort': {'view_count': -1}}, 
                                                                 {'$skip': page_size * (page_number - 1)}, 
                                                                 {'$limit': page_size}])]
        post_count = [i for i in _db.INNER_POST_COLLECTION.aggregate([{'$count': 'post_count'}])][0]['post_count']
    else : # 預設是用時間排
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}, 
                                                                 {'$sort': {'time': -1}}, 
                                                                 {'$skip': page_size * (page_number - 1)}, 
                                                                 {'$limit': page_size}])]
        post_count = [i for i in _db.INNER_POST_COLLECTION.aggregate([{'$count': 'post_count'}])][0]['post_count']
    return {'post_count' : post_count,'post_list' : post_list}

# 依貼文名稱頁數及筆數搜尋
def query_post_list_by_title(post_title,page_size,page_number,option):
    if option == 'score': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'tag': 1, 'time': 1, 'score': {'$sum': '$score.score'}, 'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                                    {'$match': {'match_title': True}},
                                                                    {'$sort': {'score': -1}}, 
                                                                    {'$skip': page_size * (page_number - 1)}, 
                                                                    {'$limit': page_size}])]
        post_count = [ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                          {'$match': {'match_title': True}},
                                                          {'$count': 'post_count'}])][0]['post_count']
    elif option == 'view_count': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'tag': 1, 'time': 1, 'score': {'$sum': '$score.score'}, 'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                                    {'$match': {'match_title': True}},
                                                                    {'$sort': {'view_count': -1}}, 
                                                                    {'$skip': page_size * (page_number - 1)}, 
                                                                    {'$limit': page_size}])]
        post_count = [ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                          {'$match': {'match_title': True}},
                                                          {'$count': 'post_count'}])][0]['post_count']
    else : # 預設是用時間排
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'tag': 1, 'time': 1, 'score': {'$sum': '$score.score'}, 'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                                    {'$match': {'match_title': True}},
                                                                    {'$sort': {'time': -1}}, 
                                                                    {'$skip': page_size * (page_number - 1)}, 
                                                                    {'$limit': page_size}])]
        post_count = [ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                          {'$match': {'match_title': True}},
                                                          {'$count': 'post_count'}])][0]['post_count']
    return {'post_count' : post_count,'post_list' : post_list}
# 依貼文標籤篩選
def query_post_list_by_tag(tag_list,page_size,page_number,option):
    if option == 'score': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}, 'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                               {'$match': {'hastag': True}},
                                                               {'$sort': {'score': -1}}, 
                                                               {'$skip': page_size * (page_number - 1)}, 
                                                               {'$limit': page_size}])]
        post_count = [ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                                       {'$match': {'hastag': True}},
                                                                       {'$count': 'post_count'}])][0]['post_count']
        
        
    elif option == 'view_count': 
       post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}, 'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                               {'$match': {'hastag': True}},
                                                               {'$sort': {'view_count': -1}}, 
                                                               {'$skip': page_size * (page_number - 1)}, 
                                                               {'$limit': page_size}])]
       post_count = [ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                                       {'$match': {'hastag': True}},
                                                                       {'$count': 'post_count'}])][0]['post_count']
    else : # 預設是用時間排
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}, 'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                               {'$match': {'hastag': True}},
                                                               {'$sort': {'time': -1}}, 
                                                               {'$skip': page_size * (page_number - 1)}, 
                                                               {'$limit': page_size}])]
        post_count = [ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                                       {'$match': {'hastag': True}},
                                                                       {'$count': 'post_count'}])][0]['post_count']
    return {'post_count' : post_count,'post_list' : post_list}
# 依post_id取得特定貼文
def query_post(post_id):
    _db.INNER_POST_COLLECTION.update_one({'_id':post_id},{'$inc':{'view_count':1}})
    return _db.INNER_POST_COLLECTION.find_one({'_id':post_id})


# 依post_id,response_id取得特定回覆
def query_response(post_id,response_id):
    post = _db.INNER_POST_COLLECTION.find_one({'_id':post_id})
    return next(response for response in post['answer'] if response['_id'] == response_id)

# 新增一筆貼文
def insert_post(post_dict):
    all_post = _db.INNER_POST_COLLECTION.find()
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
    record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'asker_id': post_dict['asker_id']}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
    _db.USER_COLLECTION.update_one({'_id':post_dict['asker_id']},{'$set':{'record.posts':record_list}})
    # 更新每個tag 的 usage_counter,recent_use
    for tag in post_dict['tag']:
        target_tag = _db.TAG_COLLECTION.find_one({'_id':tag['tag_id']})
        new_data = {
            'recent_use': post_dict['time'],
            'usage_counter':target_tag['usage_counter'] + 1
        }
        _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},{'$set':new_data})
        # 使用者相關標籤積分 + 2
        user.update_user_score(post_dict['asker_id'],tag['tag_id'],tag['tag_name'],2)

# 編輯一筆貼文內容
def update_post(post_data): 
    _db.INNER_POST_COLLECTION.update_one({'_id': post_data['_id']},{'$set':
                                                                    {
                                                                        'title':post_data['title'],
                                                                        'question':post_data['question'],
                                                                        'time':post_data['time']}})
    # 使用者發文更新
    record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'asker_id': post_data['asker_id']}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
    _db.USER_COLLECTION.update_one({'_id':post_data['asker_id']},{'$set':{'record.posts':record_list}})
    
    # 使用者回覆紀錄更新
    post = _db.INNER_POST_COLLECTION.find_one({'_id':post_data['_id']})
    for response in post['answer']:
        record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'answer.replier_id': response['replier_id']}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
        _db.USER_COLLECTION.update_one({'_id':response['replier_id']},{'$set':{'record.responses':record_list}})
        

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
    _db.INNER_POST_COLLECTION.update_one({'_id':target_post['_id']},{'$push':{'answer':response_dict}})
    # 更新使用者回覆紀錄
    record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'answer.replier_id': response_dict['replier_id']}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
    _db.USER_COLLECTION.update_one({'_id':response_dict['replier_id']},{'$set':{'record.responses':record_list}})
    # 更新每個tag 的 usage_counter,recent_use
    for tag in target_post['tag']:
        target_tag = _db.TAG_COLLECTION.find_one({'_id':tag['tag_id']})
        _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},
            {'$set':{
                'recent_use':response_dict['time'],
                'usage_counter':target_tag['usage_counter'] + 1}})
        # 使用者相關標籤積分 + 1
        user.update_user_score(response_dict['replier_id'],tag['tag_id'],tag['tag_name'], 1)
    

# 編輯貼文回覆
def update_response(response_dict):
    post_id = response_dict.pop('post_id')
    _db.INNER_POST_COLLECTION.update_one({'_id':post_id,'answer._id':response_dict['_id']},
                                         {'$set':{'answer.$.response':response_dict['response'],
                                                  'answer.$.time':response_dict['time']}})

# 編輯貼文評分
def update_score(score_dict):
    target_post = _db.INNER_POST_COLLECTION.find_one({'_id':score_dict['post_id']})
    new_score_record = {
                'user_id': score_dict['user'],
                'score' : score_dict['score']
    }
    # response_id為空表示更新貼文評分
    if len(score_dict['response_id']) == 0 :
        # 若使用者按過讚/倒讚，使用set
        if any(s['user_id'] == score_dict['user'] for s in target_post['score']):
            _db.INNER_POST_COLLECTION.update_one({'_id':score_dict['post_id'],'score.user_id': score_dict['user']},{'$set':{'score.$':new_score_record}})
            original_score_record = next(s for s in target_post['score'] if s['user_id'] == score_dict['user'])
            # 更新被按的人的技能分數
            for tag in target_post['tag']:
                user.update_user_score(target_post['asker_id'],tag['tag_id'],tag['tag_name'],new_score_record['score'] - original_score_record['score'])
        else:
            # 貼文本身push一個使用者評分
            _db.INNER_POST_COLLECTION.update_one({'_id':score_dict['post_id']},{'$push':{'score':new_score_record}})
            # 更新被讚的人的技能分數
            for tag in target_post['tag']:
                user.update_user_score(target_post['asker_id'],tag['tag_id'],tag['tag_name'],new_score_record['score'])
        # 使用者發文紀錄更新
        record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'asker_id': target_post['asker_id']}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
        _db.USER_COLLECTION.update_one({'_id':target_post['asker_id']},{'$set':{'record.posts':record_list}})
        # 使用者回覆紀錄更新
        for response in target_post['answer']:
            record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'answer.replier_id': response['replier_id']}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
        _db.USER_COLLECTION.update_one({'_id':response['replier_id']},{'$set':{'record.responses':record_list}})
    
    # response_id不為空表示更新回覆評分
    else :
        target_response = query_response(score_dict['post_id'],score_dict['response_id'])
        # 若使用者按過讚/倒讚，使用set
        if any(s['user_id'] == score_dict['user'] for s in target_response['score']):
            original_score_record = next(s for s in target_response['score'] if s['user_id'] == score_dict['user'])
            _db.INNER_POST_COLLECTION.update_one({'_id':score_dict['post_id'],'answer._id':score_dict['response_id']},{'$pull':{'answer.$.score':original_score_record}})
            _db.INNER_POST_COLLECTION.update_one({'_id':score_dict['post_id'],'answer._id':score_dict['response_id']},{'$push':{'answer.$.score':new_score_record}})
            for tag in target_post['tag']:
                user.update_user_score(target_response['replier_id'],tag['tag_id'],tag['tag_name'],new_score_record['score'] - original_score_record['score'])
        else:
            _db.INNER_POST_COLLECTION.update_one({'_id':score_dict['post_id'],'answer._id':score_dict['response_id']},{'$push':{'answer.$.score':new_score_record}})
            for tag in target_post['tag']:
                user.update_user_score(target_response['replier_id'],tag['tag_id'],tag['tag_name'],new_score_record['score'])
# 刪除貼文
def remove_post(post_id):
    post_dict = _db.INNER_POST_COLLECTION.find_one({'_id':post_id})
    response_list = post_dict['answer']
    tag_usage = len(post_dict['answer']) + 1
    # 依標籤扣除使用者分數
    tag_usage = len(post_dict['answer']) + 1
    for tag in post_dict['tag']:
        # 扣除發文時的分數
        user.update_user_score(post_dict['asker_id'],tag['tag_id'],tag['tag_name'],-2)
        user.update_user_score(post_dict['asker_id'],tag['tag_id'],tag['tag_name'],-sum(score['score'] for score in post_dict['score']))
        # 扣除每則回應的分數
        for response in post_dict['answer']:
            user.update_user_score(response['replier_id'],tag['tag_id'],tag['tag_name'],-1)
            user.update_user_score(response['replier_id'],tag['tag_id'],tag['tag_name'],-sum(score['score'] for score in response['score']))
        # 扣除tag usage_count(發文(1)+回應數)
        _db.TAG_COLLECTION.update_one({'_id':tag['tag_id']},{'$inc':{'usage_counter': -tag_usage}})
    # 從collection移除post
    _db.INNER_POST_COLLECTION.delete_one({'_id':post_id})
    # 使用者發文紀錄更新
    record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'asker_id': post_dict['asker_id']}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
    _db.USER_COLLECTION.update_one({'_id':post_dict['asker_id']},{'$set':{'record.posts':record_list}})
    # 使用者回覆紀錄更新
    for response in response_list:
        record_list = [doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$match': {'answer.replier_id': response['replier_id']}}, 
                                                                       {'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1, 'score': {'$sum': '$score.score'}}}])]
        _db.USER_COLLECTION.update_one({'_id':response['replier_id']},{'$set':{'record.responses':record_list}})
    

'''湘的'''
#內部搜尋
def query_inner_search(keywords):
    # version2，可調整第一階篩選數、factor權重、output數
    return [i['_id'] for i in _db.INNER_POST_COLLECTION.aggregate(
    [
    {
        '$match': {
            '$or': [
                {
                    'tag.tag_name': {
                        '$in': keywords
                    }
                }, {
                    'keyword': {
                        '$in': keywords
                    }
                }
            ]
        }
    }, {
        '$project': {
            'keyword': 1,
            'tag': 1,
            'score': 1,
            'answer': 1,
            'view_count': 1
        }
    }, {
        '$unwind': {
            'path': '$tag'
        }
    }, {
        '$match': {
            'tag.tag_name': {
                '$in': keywords
            }
        }
    }, {
        '$group': {
            '_id': '$_id',
            'matches_tag': {
                '$sum': 1
            },
            'score': {
                '$first': '$score'
            },
            'keyword': {
                '$first': '$keyword'
            },
            'answer': {
                '$first': '$answer'
            },
            'view_count': {
                '$first': '$view_count'
            }
        }
    }, {
        '$unwind': {
            'path': '$keyword'
        }
    }, {
        '$match': {
            'keyword': {
                '$in': keywords
            }
        }
    }, {
        '$group': {
            '_id': '$_id',
            'matches_keyword': {
                '$sum': 1
            },
            'score': {
                '$first': '$score'
            },
            'matches_tag': {
                '$first': '$matches_tag'
            },
            'answer': {
                '$first': '$answer'
            },
            'view_count': {
                '$first': '$view_count'
            }
        }
    }, {
        '$project': {
            'matches': {
                '$sum': [
                    '$matches_tag', '$matches_keyword'
                ]
            },
            'score': 1,
            'answer': 1,
            'view_count': 1
        }
    }, {
        '$project': {
            'scoreTotal': {
                '$sum': '$score.score'
            },
            'matches': 1,
            'answer': 1,
            'view_count': 1
        }
    }, {
        '$sort': {
            'matches': -1,
            'scoreTotal': -1,
            '_id': 1
        }
    }, {
        '$limit': 10
    }, {
        '$sort': {
            'matches': -1,
            'scoreTotal': -1,
            '_id': 1
        }
    }, {
        '$group': {
            '_id': '1',
            'items': {
                '$push': '$$ROOT'
            }
        }
    }, {
        '$unwind': {
            'path': '$items',
            'includeArrayIndex': 'items.matches_scoreTotal_order'
        }
    }, {
        '$replaceRoot': {
            'newRoot': '$items'
        }
    }, {
        '$unwind': {
            'path': '$answer',
            'preserveNullAndEmptyArrays': True
        }
    }, {
        '$unwind': {
            'path': '$answer.score',
            'preserveNullAndEmptyArrays': True
        }
    }, {
        '$group': {
            '_id': {
                '_id': '$_id',
                'ans': '$answer._id'
            },
            'totalAnsScore': {
                '$sum': '$answer.score.score'
            },
            'matches_scoreTotal_order': {
                '$first': '$matches_scoreTotal_order'
            },
            'view_count': {
                '$first': '$view_count'
            }
        }
    }, {
        '$group': {
            '_id': '$_id._id',
            'maxTotalAnsScore': {
                '$max': '$totalAnsScore'
            },
            'matches_scoreTotal_order': {
                '$first': '$matches_scoreTotal_order'
            },
            'view_count': {
                '$first': '$view_count'
            }
        }
    }, {
        '$sort': {
            'view_count': -1,
            'maxTotalAnsScore': -1,
            '_id': 1
        }
    }, {
        '$group': {
            '_id': '1',
            'items': {
                '$push': '$$ROOT'
            }
        }
    }, {
        '$unwind': {
            'path': '$items',
            'includeArrayIndex': 'items.viewCount_maxTotalAnsScore_order'
        }
    }, {
        '$replaceRoot': {
            'newRoot': '$items'
        }
    }, {
        '$addFields': {
            'output_order': {
                '$add': [
                    {
                        '$multiply': [
                            '$matches_scoreTotal_order', 0.5
                        ]
                    }, {
                        '$multiply': [
                            '$viewCount_maxTotalAnsScore_order', 0.2
                        ]
                    }
                ]
            }
        }
    }, {
        '$sort': {
            'output_order': 1,
            '_id': 1
        }
    }, {
        '$limit': 3
    }
]
    )]
'''香的'''
