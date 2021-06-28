#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Apr 23 21:52:20 2021

@author: linxiangling
"""
from . import _db


#查詢 user
def query_user(user_id):
    return _db.USER_COLLECTION.find_one({'userID':user_id})



