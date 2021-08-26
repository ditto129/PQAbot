#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr 19 19:00:01 2021

@author: linxiangling
"""

import requests 
import json
import flask
from flask import request, Blueprint, jsonify
from models import user

discussion_api=Blueprint('discussion_api', __name__)

head_url='http://localhost:55001/api/'
#head_url='https://soselab.asuscomm.com:55002/api/'

#共同討論推薦user
@discussion_api.route('discussion_recommand_user', methods=['POST'])
def discussion_recommand_user():
    first_level = requests.get(head_url + 'query_all_languages')
    
    data = request.get_json()
    tags = data['tags']
    #初步篩選
    users = user.query_skill_discussion_initial_filter(tags)
    #加權
    for i in users:
        sort_scores = 0
        for j in i['skill']:
            if j in first_level:
                sort_scores += (j['interested_score']+j['score']) * 1
            else:
                sort_scores += (j['interested_score']+j['score']) * 3
        i.update({'sort_scores':sort_scores})
    #排序
    sorted_users = sorted(users, key=lambda k: k['sort_scores'], reverse=True)
    stage1_id_array = [i['_id'] for i in sorted_users]
    #print("stage1_id_array ", stage1_id_array)
    #print('sorted_users ', sorted_users)
    #不足十人，找更多人推薦
    if len(users) < 10:
        lacking_num = 10 - len(users)
        stage2_id_array = user.query_skill_discussion_scores_only(stage1_id_array, tags, lacking_num)
        #print("stage2_id_array ", stage2_id_array)
        stage1_id_array.extend(stage2_id_array)
    else:
        stage1_id_array = stage1_id_array[0:10]
    return jsonify({"recommand_user_id":stage1_id_array})
    
