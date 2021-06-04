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
#from .Translate import Translate



base_flow_rasa_api=Blueprint('base_flow_rasa_api', __name__)
@base_flow_rasa_api.route('base_flow_rasa')
def base_flow_rasa():
    sender_id=request.values.get('sender_id')
    print('sender_id'+sender_id)
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
        
@base_flow_rasa_api.route('chat_accepted', methods=['post'])
def chat_accepted():
    param=request.get_json()
    print('chat_accepted')
    print('event_name: '+ param['event_name'])
    print('chat_id: '+str(param['chat_id']))
    return jsonify({"message":"success"})
    
#https://wh.jivosite.com/IF6YK0nYgC56npYB/vKIgQjkZ0T

@base_flow_rasa_api.route('process', methods=['post'])
def process():
    param=request.get_json()
    print('process')
    print('event: '+ param['event'])
    print('id: '+str(param['id']))
    return jsonify({
  "event": "BOT_MESSAGE",
  "id": "123e4567-e89b-12d3-a456-426655440000",
  "message": {
    "type": "BUTTONS",
      "title": "Are you interested in delivery within the New York area?",
      "text": "Are you interested in delivery within the New York area? Yes / No",
      "timestamp": "1583910736",
      "buttons": [
        {
          "text": "Yes",
          "id": "1"
        }, {
          "text": "No",
          "id": "2"
        }
      ]
  }
})
