#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr 26 19:07:59 2021

@author: shauangel
"""

import spacy
from spacy.lang.en.stop_words import STOP_WORDS  ##停用詞
from spacy_langdetect import LanguageDetector
from string import punctuation                   ##標點符號
from collections import Counter
from heapq import nlargest
from Translate import Translate
##similarity ranking
#import numpy as np
#from scipy.spatial.distance import cosine
#from sklearn.feature_extraction.text import TfidfVectorizer
##testing
#from OuterSearch import outerSearch

#文字分析模組 - stackoverflow外部資料 & PQAbot系統內部資料
class TextAnalyze:
    
    STOPWORDS = list(STOP_WORDS)               ##停用詞: 可忽略的詞，沒有賦予上下文句意義的詞
    POS_TAG = ['PROPN', 'ADJ', 'NOUN', 'VERB'] ##欲留下的詞類
    
    #_type: inner data or outer data
    def __init__(self):
        return
        
    #語言辨識
    def checkLanguage(self, text):
        nlp = spacy.load('en_core_web_sm')
        nlp.add_pipe(LanguageDetector(), name='language_detector', last=True)
        doc = nlp(text)
        print(doc._.language)
        return
    
    #關鍵字提取(需要提供)
    def keywordExtration(self, text):
        translator = Translate(text)
        en_text = translator.getTranslate()
        keyword = []
        nlp = spacy.load('en_core_web_sm')
        doc = nlp(en_text.lower())
        for token in doc:  #若該token為停用詞或標點符號則捨去，若詞類符合pos_tag則加入保留詞list
            if(token.text in self.STOPWORDS or token.text in punctuation):
                continue
            if(token.pos_ in self.POS_TAG):
                keyword.append(token.text)
        return keyword, doc
    
    #取得文章摘要 - extractive summarization
    def textSummarization(self, text):
        ###Step 2.過濾必要token
        keyword, doc = self.keywordExtration(text)##保留詞
        freq_word = Counter(keyword)               #計算關鍵詞的出現次數
        ###Step 3.正規化
        max_freq_word = Counter(keyword).most_common(1)[0][1]  #取得最常出現單詞次數
        for word in freq_word.keys():
            freq_word[word] = freq_word[word]/max_freq_word    #正規化處理
        ###Step 4.sentence加權
        sentence_w = {}
        for sen in doc.sents:
            for word in sen:
                if word.text in freq_word.keys():
                    if sen in sentence_w.keys():
                        sentence_w[sen] += freq_word[word.text]
                    else:
                        sentence_w[sen] = freq_word[word.text]
        ###Step 5.nlargest(句子數量, 可迭代之資料(句子&權重), 分別須滿足的條件)
        summarized_sen = nlargest(3, sentence_w, key=sentence_w.get)
        
        return summarized_sen
        
"""
    #關聯度評分
    ##input(question kewords, pure word of posts' question)
    def similarityRanking(self, question_key, compare_list):
        nlp = spacy.load('en_core_web_lg')
        #tokenize, word2vec
        ###1. 處理短文本（使用者問句）
        main_word_list = [nlp(word).vector for word in question_key]  #vectorize words seperately 
        main_vector = np.mean(main_word_list, axis=0).sum()   #calculate sentence vector
        
        #tf-idf
        ###2. 處理長文本
        vectorizer = TfidfVectorizer(min_df=1)
        tdidf = vectorizer.fit_transform(compare_list)
        words = vectorizer.get_feature_names()
        score = tdidf.toarray()
        test = score!=0
        print(test)
        return
    
    
        
    
        
        
        
if __name__ == "__main__": 
    q = "Why does flask still not work after adding cors (app)"
    test = TextAnalyze()
    k, doc = test.keywordExtration(q)
    print(k)
    url_result = outerSearch(k, 10, 1)


"""
        
        
        
        
        
        
        
    