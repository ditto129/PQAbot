#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr 28 16:29:09 2021

@author: shauangel
"""

from stackapi import StackAPI
from urllib.parse import urlparse, unquote
from pathlib import PurePosixPath
from bs4 import BeautifulSoup

#存放stackoverflow的post資料
#包含取得資料的函式
class StackData:
    def __init__(self, url):
        #取得問題id
        self.id = PurePosixPath(urlparse(unquote(url)).path).parts[2]
        self.link = url
        #設定stackAPI工具
        self.site = StackAPI('stackoverflow')
        self.site.page_size = 10
        self.site.max_pages = 1
        self.question, bestAnsID = self.__getQuestion()
        self.answers = self.__getAnswers(self.id)
    
    #private method: 取得問題資訊
    def __getQuestion(self):
        data = self.site.fetch('questions', filter='withbody', ids=[self.id])['items'][0]
        comments = self.__getComments('questions/{ids}/comments', [self.id])
        result = {
                "id" : self.id,
                "title" : data['title'], 
                "content" : self.__addClass2Code(data['body']), 
                "abstract" : self.__getPureText(data['body']), 
                "comments" : comments
                }
        if 'accepted_answer_id' in data.keys():
            return result, data['accepted_answer_id']
        else:
            return result, ""
    
    #private method: 取得答案資訊, 最佳解&其他解
    def __getAnswers(self, ids):
        data = self.site.fetch('questions/{ids}/answers', filter='withbody', ids=[ids], sort='votes', order='desc')['items']
        result = []
        for ans in data:
            comments = self.__getComments('answers/{ids}/comments', [ans['answer_id']])
            result.append({
                    "id" : ans['answer_id'],
                    "score" : ans['score'],
                    "content" : self.__addClass2Code(ans['body']),
                    "abstract" : self.__getPureText(ans['body']),
                    "comments" : comments
                    })
        return result
    #private method: 取得該區塊留言
    def __getComments(self, query, ids):
        data = self.site.fetch(query, filter='withbody', sort='votes', ids=ids)
        result = [ i['body'] for i in data['items'] ]
        return result
    
    def __getPureText(self, html):
        #get sentences without html tag & code
        soup = BeautifulSoup(html, 'html.parser')
        abstract = [i.text for i in soup.findAll('p')]
        result = " ".join(abstract)
        return result
    
    def __addClass2Code(self, html):
        soup = BeautifulSoup(html, 'html.parser')
        pre = soup.findAll('pre')
        for p in pre:
            code = p.find('code')
            code['class'] = code.get('class', []) + ['python']
            p.replaceWith(p)
        return str(soup)
    
    def showData(self):
        display = {
                "link" : self.link,
                "question" : self.question,
                "answers" : self.answers
                }
        return display
    
    def insertDB(self):
        return
    
    
    
    
if __name__ == "__main__":
    url = "https://stackoverflow.com/questions/231767/what-does-the-yield-keyword-do"
    test = StackData(url)
    d = test.showData()
    for k in d:
        print(k + ": ")
        print(d[k])
    
    
    
    
