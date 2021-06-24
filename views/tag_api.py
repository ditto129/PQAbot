#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Jun 24 15:24:03 2021

@author: linxiangling
"""

from flask import Blueprint, jsonify, request
from models import tag

tag_api=Blueprint('tag_api', __name__)

@tag_api.route('build_initial_tag', methods=['get'])
def build_initial_tag():
    first_level_tag_name = 'Python'
    second_level_tag_name = ['Web Crawing Data/Mining', 'Web frameworks', 'NLP', 'game development', 'standard libraries', 'GUI', 'Data processing']
    #third_level_tag_name
    Web_Crawing_Data_Mining = ['Requests', 'LXML', 'BeautifulSoup', 'Selenium', 'Scrapy', 'urlib2', 'PySpider', 'MechanicalSoup']
    NLP = ['NLTK', 'TextBlob', 'CoreNLP', 'Gensim', 'spaCy', 'polyglot', 'Pattern', 'PyNLPI', 'SciKit-Learn', 'jieba', 'monpa', 'Vocabulary', 'Quepy']
    GUI = ['Tkinter', 'wxPython', 'Kivy', 'Libavg', 'pyQT', 'PySimpleGUI', 'Pyforms', 'Wax', 'PySide']
    Web_frameworks = ['Django', 'Pyramid', 'TurboGears', 'Tornado', 'web2py', 'Zope', 'Flask', 'Bottle', 'CherrPy', 'Falcon', 'Hug', 'Grok', 'BlueBream', 'Quixote']
    game_development = ['Pygame', 'PyKyra', 'Pyglet', 'PyOpenGL', 'Panda3D', 'Cocos2d', 'Python-Ogre', 'Ren\'Py']
    Data_Processing = ['NumPy', 'SciPy', 'Pandas', 'Keras', 'SciKit-Learn', 'PyTorch', 'TensorFlow', 'XGBoost', 'matplotlib', 'Seaborn', 'Bokeh', 'Plotly', 'pydot', 'Statsmodels']
    standard_libraries = []
    third_level_tag_name=[Web_Crawing_Data_Mining, Web_frameworks, NLP, game_development, standard_libraries, GUI, Data_Processing]
    
    
    first_level_dict = {'id':'', 'name':first_level_tag_name}
    second_level_dict = [{'id':'', 'name':i} for i in second_level_tag_name]
    third_level_dict = [[{'id':'', 'name':i} for i in j] for j in third_level_tag_name]
    
    #建立第一層
    tag_id = tag.insert_tag(first_level_dict['name'])
    first_level_dict['id'] = tag_id

    #建立第二層
    for i in second_level_dict:
        tag_id = tag.insert_tag(i['name'])
        i['id'] = tag_id
        tag.add_child_tag(first_level_dict['id'], tag_id)

    #建立第三層
    index=0
    for i in third_level_dict:
        for j in i:
            print(second_level_dict[index]['id'])
            tag_id = tag.insert_tag(j['name'])
            j['id'] = tag_id
            tag.add_child_tag(second_level_dict[index]['id'], tag_id)
        index+=1
            
    return jsonify({'message':'success'})
        
   
    
   
    
   
    
   
    
