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
from sklearn import preprocessing

# 取得所有貼文列表
def query_post_list(page_size,page_number,option):
    if option == 'score': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}}}, 
                                                                 {'$sort': {'score': -1}}, 
                                                                 {'$skip': page_size * (page_number - 1)}, 
                                                                 {'$limit': page_size}])]
        post_count = [i for i in _db.INNER_POST_COLLECTION.aggregate([{'$count': 'post_count'}])][0]['post_count']
    elif option == 'view_count': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}}}, 
                                                                 {'$sort': {'view_count': -1}}, 
                                                                 {'$skip': page_size * (page_number - 1)}, 
                                                                 {'$limit': page_size}])]
        post_count = [i for i in _db.INNER_POST_COLLECTION.aggregate([{'$count': 'post_count'}])][0]['post_count']
    else : # 預設是用時間排
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}}}, 
                                                                 {'$sort': {'time': -1}}, 
                                                                 {'$skip': page_size * (page_number - 1)}, 
                                                                 {'$limit': page_size}])]
        post_count = [i for i in _db.INNER_POST_COLLECTION.aggregate([{'$count': 'post_count'}])][0]['post_count']
    return {'post_count' : post_count,'post_list' : post_list}

# 依貼文名稱頁數及筆數搜尋
def query_post_list_by_title(post_title,page_size,page_number,option):
    if option == 'score': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'tag': 1, 'time': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}, 'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                                    {'$match': {'match_title': True}},
                                                                    {'$sort': {'score': -1}}, 
                                                                    {'$skip': page_size * (page_number - 1)}, 
                                                                    {'$limit': page_size}])]
        post_count = len([ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                          {'$match': {'match_title': True}}])])
    elif option == 'view_count': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'tag': 1, 'time': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}, 'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                                    {'$match': {'match_title': True}},
                                                                    {'$sort': {'view_count': -1}}, 
                                                                    {'$skip': page_size * (page_number - 1)}, 
                                                                    {'$limit': page_size}])]
        post_count = len([ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                          {'$match': {'match_title': True}}])])
    else : # 預設是用時間排
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'tag': 1, 'time': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}, 'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                                    {'$match': {'match_title': True}},
                                                                    {'$sort': {'time': -1}}, 
                                                                    {'$skip': page_size * (page_number - 1)}, 
                                                                    {'$limit': page_size}])]
        post_count = len([ i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'match_title': {'$regexMatch': {'input': '$title', 'regex': '.*' + post_title + '.*'}}}}, 
                                                          {'$match': {'match_title': True}}])])
    return {'post_count' : post_count,'post_list' : post_list}
# 依貼文標籤篩選
def query_post_list_by_tag(tag_list,page_size,page_number,option):
    if option == 'score': 
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}, 'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                               {'$match': {'hastag': True}},
                                                               {'$sort': {'score': -1}}, 
                                                               {'$skip': page_size * (page_number - 1)}, 
                                                               {'$limit': page_size}])]
        post_count = len([i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                                       {'$match': {'hastag': True}}])])
        
        
    elif option == 'view_count': 
       post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}, 'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                               {'$match': {'hastag': True}},
                                                               {'$sort': {'view_count': -1}}, 
                                                               {'$skip': page_size * (page_number - 1)}, 
                                                               {'$limit': page_size}])]
       post_count = len([i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                                       {'$match': {'hastag': True}}])])
    else : # 預設是用時間排
        post_list = [ doc for doc in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'_id': 1, 'title': 1, 'time': 1, 'tag': 1,'asker_id': 1,'icognito': 1, 'score': {'$sum': '$score.score'}, 'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                               {'$match': {'hastag': True}},
                                                               {'$sort': {'time': -1}}, 
                                                               {'$skip': page_size * (page_number - 1)}, 
                                                               {'$limit': page_size}])]
        post_count = len([i for i in _db.INNER_POST_COLLECTION.aggregate([{'$project': {'hastag': {'$setIsSubset': [tag_list, '$tag']}}}, 
                                                                       {'$match': {'hastag': True}}])])
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
    user.update_post_list(post_dict['asker_id'])
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
                                                                        'keyword':post_data['keyword'],
                                                                        'time':post_data['time']}})
    # 使用者發文更新
    user.update_post_list(post_data['asker_id'])
    
    # 使用者回覆紀錄更新
    post = _db.INNER_POST_COLLECTION.find_one({'_id':post_data['_id']})
    for response in post['answer']:
        user.update_response_list(response['replier_id'])
        

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
    user.update_response_list(response_dict['replier_id'])
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
        # 更新使用者發文紀錄
        user.update_post_list(target_post['asker_id'])
        # 更新使用者回覆紀錄
        for response in target_post['answer']:
            user.update_response_list(response['replier_id'])
    
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
    # 更新使用者發文紀錄
    user.update_post_list(post_dict['asker_id'])
    # 更新使用者回覆紀錄
    for response in response_list:
        user.update_response_list(response['replier_id'])
    
    

'''湘的'''
#內部搜尋
def query_inner_search(keywords):
    tag=[]
    keyword=[]
    for i in keywords:
        keyword.append({'keyword':{'$regex':i, '$options':'i'}})
        tag.append({'tag.tag_name':{'$regex':i, '$options':'i'}})
    tag.extend(keyword)
#    print(keyword)
#    print(tag)
#    print(tag)
    #第一階篩選數(相關貼文)，對資料做前處理（算好問題積分、最高答案積分）
    top_ten_post_dict_array = [{'_id':i['_id'], 'maxTotalAnsScore':i['maxTotalAnsScore'], 'keyword':i['keyword'], 'tag':i['tag'], 'scoreTotal':i['scoreTotal'], 'view_count':i['view_count']} for i in _db.INNER_POST_COLLECTION.aggregate(
    [
    {
        '$match': {
            '$or': tag
        }
    }, {
        '$limit': 10
     }, {
        '$project': {
            'keyword': 1,
            'tag': 1,
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
            'view_count': 1,
            'keyword': 1,
            'tag': 1
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
            'view_count': {
                '$first': '$view_count'
            },
            'keyword': {
                '$first': '$keyword'
            },
            'tag': {
                '$first': '$tag'
            },
            'scoreTotal': {
                '$first': '$scoreTotal'
            }
        }
    }, {
        '$group': {
            '_id': '$_id._id',
            'maxTotalAnsScore': {
                '$max': '$totalAnsScore'
            },
            'view_count': {
                '$first': '$view_count'
            },
            'keyword': {
                '$first': '$keyword'
            },
            'tag': {
                '$first': '$tag'
            },
            'scoreTotal': {
                '$first': '$scoreTotal'
            }
        }
    }
]
    )]
#    print("篩選結果：")
#    print(top_ten_post_dict_array)
    if len(top_ten_post_dict_array) > 0:
        #計算keyword match數
        for i in top_ten_post_dict_array:
            count = 0
            i['matches_keyword'] = 0
            for j in i['keyword']:
                if j in keywords:
                    count += 1
            i['matches_keyword'] = count
            
        #計算tag match數
        for i in top_ten_post_dict_array:
            count = 0
            i['matches_tag'] = 0
            for j in i['tag']:
                if j['tag_name'] in keywords:
                    count += 1
            i['matches_tag'] = count
            
        a=[]
        b=[]
        c=[]
        d=[]
        #加總match數
        for i in top_ten_post_dict_array:
            i['matches'] = i['matches_keyword'] + i['matches_tag']
            a.append(i['matches'])
            b.append(i['scoreTotal'])
            c.append(i['view_count'])
            d.append(i['maxTotalAnsScore'])
        
        normalized_matches = preprocessing.normalize([a])[0]
        normalized_scoreTotal = preprocessing.normalize([b])[0]
        normalized_view_count = preprocessing.normalize([c])[0]
        normalized_maxTotalAnsScore = preprocessing.normalize([d])[0]
        
        for index, i in enumerate(top_ten_post_dict_array):
            i['normalized_matches'] = normalized_matches[index]
            i['normalized_scoreTotal'] = normalized_scoreTotal[index]
            i['normaliznormalized_view_counted_scoreTotal'] = normalized_view_count[index]
            i['normalized_maxTotalAnsScore'] = normalized_maxTotalAnsScore[index]
        
        """法一"""
    #    #根據matches, scoreTotal排名
    #    sorted_top_ten_post_dict_array = sorted(top_ten_post_dict_array, key=lambda k: (k['matches'], k['scoreTotal'], k['_id']), reverse=True)
    #    for count, i in enumerate(sorted_top_ten_post_dict_array):
    #        i['matches_scoreTotal_order'] = count
    #
    #    #根據view_count, maxTotalAnsScore排名
    #    sorted_top_ten_post_dict_array = sorted(sorted_top_ten_post_dict_array, key=lambda k: (k['view_count'], k['maxTotalAnsScore'], k['_id']), reverse=True)
    #    for count, i in enumerate(sorted_top_ten_post_dict_array):
    #        i['view_count_maxTotalAnsScore_order'] = count
    #
    #    #加權
    #    for i in sorted_top_ten_post_dict_array:
    #        i['output_order'] = i['matches_scoreTotal_order'] * 0.5 + i['view_count_maxTotalAnsScore_order'] * 0.2
    #    sorted_top_ten_post_dict_array = sorted(sorted_top_ten_post_dict_array, key=lambda k: (k['output_order'], k['_id']))
        """   """
        
        """法二"""
        #加權(5, 3, 2, 1)
        for i in top_ten_post_dict_array:
            i['output_order'] = i['normalized_matches'] * 5 + i['normalized_scoreTotal'] * 3 + i['normaliznormalized_view_counted_scoreTotal'] * 2 + i['normalized_maxTotalAnsScore']
        sorted_top_ten_post_dict_array = sorted(top_ten_post_dict_array, key=lambda k: (k['output_order'], k['_id']), reverse=True)
        """  """
        
        print(sorted_top_ten_post_dict_array)
        return [i['_id'] for i in sorted_top_ten_post_dict_array]
    else:
        print([])
        return []
'''香的'''
