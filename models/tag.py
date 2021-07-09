#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Apr 23 21:52:20 2021

@author: linxiangling
"""
from . import _db

#新增 empty tag
def insert_tag(tag_name):
    data=_db.TAG_COLLECTION.find()
    if data.count() != 0:
        tag_id=str(int(data.sort('_id', -1)[0]['_id'])+1).zfill(5)
    else:
        tag_id='00000'
    tag_dict = {'_id':tag_id, 'tag':tag_name, 'child':[], 'parent':'', 'associated':[], 'usage_counter':0, 'recent_use':''}
    _db.TAG_COLLECTION.insert_one(tag_dict)
    return tag_id
    
#新增 child tag
def add_child_tag(parent_id, parent_name, child_id, child_name):
    _db.TAG_COLLECTION.update({'_id':parent_id}, {'$push':{'child':{'tag_id':child_id, 'tag_name':child_name}}})
    _db.TAG_COLLECTION.update({'_id':child_id}, {'$set':{'parent':{'tag_id':parent_id, 'tag_name':parent_name}}})
    
#新增 associated tag
def add_child_associated(parent_id, associated_id, associated_name):
    _db.TAG_COLLECTION.update({'_id':parent_id}, {'$push':{'associated':{'tag_id':associated_id, 'tag_name':associated_name}}})
    
#查詢 tag
def query_tag(tag_id):
    return _db.TAG_COLLECTION.find_one({'_id':tag_id})


#所有語言 tag
def query_all_languages():
    tags = [{'_id':i['_id'], 'tag':i['tag']} for i in _db.TAG_COLLECTION.find({'parent':''})]
    return tags
    
#回傳 child, child 含 tag_name, tad_id
def query_childs(tag_id):
    tags = _db.TAG_COLLECTION.find_one({'_id':tag_id})['child']
    return tags

#回傳 tag name, id
def query_tag_name_id_child(tag_id):
    tag = _db.TAG_COLLECTION.find_one({'_id':tag_id})
    return {'tag_name':tag['tag'], 'tag_id':tag['_id'], 'child':tag['child']}
