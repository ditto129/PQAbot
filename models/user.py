from . import _db



    
def insert_user_profile(user_dict):
    _db.USER_COLLECTION.insert_one(user_dict)
    
def get_user_profile(user_id):
    item = _db.USER_COLLECTION.find_one({'userID' : user_id})
    return item
    
    
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Apr 23 21:52:20 2021

@author: linxiangling
"""
#查詢 user
def query_user(user_id):
    return _db.USER_COLLECTION.find_one({'userID':user_id})

