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


welcome_api=Blueprint('welcome_api', __name__)
@welcome_api.route('welcome')
def welcome():
    payload = {'sender': 'user', 'message': 'start'}
    headers = {'content-type': 'application/json'}
    r = requests.post('http://localhost:5005/webhooks/rest/webhook', json=payload, headers=headers)
    print(r.json())
    return r.json()[0]

ask_os_api=Blueprint('ask_os_api', __name__)
@ask_os_api.route('ask_os')
def ask_os():
    payload = {'sender': 'user', 'message': 'ask_os'}
    headers = {'content-type': 'application/json'}
    r = requests.post('http://localhost:5005/webhooks/rest/webhook', json=payload, headers=headers)
    print(r.json())
    return r.json()[0]