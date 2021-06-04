#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr 19 20:48:00 2021
@author: linxiangling
"""

import requests
import json
import flask
from flask import request, Blueprint, jsonify
from .Translate import Translate



base_flow_rasa_api=Blueprint('base_flow_rasa_api', __name__)
@base_flow_rasa_api.route('base_flow_rasa')
def base_flow_rasa():
    sender_id=request.values.get('sender_id')
    message=request.values.get('message')
    #translatedMessage=Translate(message).getTranslate()
    #print(translatedMessage)
    payload = {'sender': sender_id, 'message': message}
    headers = {'content-type': 'application/json'}
    r = requests.post('http://localhost:5005/webhooks/rest/webhook', json=payload, headers=headers)
    print(r.json())
    if len(r.json()) == 0:
        return jsonify({"message":"no triggered intent"})
    else:
        return r.json()[0]
