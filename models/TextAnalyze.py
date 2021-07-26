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
from .Translate import Translate
###LDA model
from gensim.corpora.dictionary import Dictionary
from gensim.models import LdaModel

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
            if(token.pos_ == "NOUN"):
                keyword.append(token.text)
                continue
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
        
    #關聯度評分
    ##input(question kewords, pure word of posts' question)
    def similarityRanking(self, question_key, compare_list):
        nlp = spacy.load('en_core_web_lg')
        print(len(compare_list))
        ##Lemmatization
        comp_lemmatization_list = []
        for sens in compare_list:
            temp = []
            tokens = nlp(sens)
            for token in tokens:
                if(token.lemma_ in temp or token.text in punctuation or (token.text in self.STOPWORDS and token.pos_ != "NOUN")):
                    continue
                else: 
                    temp.append(token.lemma_)
            comp_lemmatization_list.append(temp)
        print("---------------------------")
        ##LDA topic modeling
        dictionary = Dictionary(comp_lemmatization_list)
        corpus = [dictionary.doc2bow(text) for text in comp_lemmatization_list]
        lda_model = LdaModel(corpus, num_topics=7, id2word=dictionary)
        for idx, topic in lda_model.show_topics():
            print("Topic: {} \nWords: {}".format(idx, topic))
            print("\n")
        print("---------------------------")
        ##topic prediction
        q_bow = dictionary.doc2bow(question_key)
        q_topic = sorted(lda_model.get_document_topics(q_bow), key=lambda x:x[1], reverse=True)[0][0]
        q_topic_keywords = " ".join([w[0] for w in lda_model.show_topics(formatted=False, num_words=5)[q_topic][1]])
        q_vec = nlp(q_topic_keywords)
        score_result = [q_vec.similarity(nlp(" ".join(comp))) for comp in comp_lemmatization_list]
        return score_result


        

     
if __name__ == "__main__": 
    q = "What is “if __name__ == __main__:” ?"
    analyzer = TextAnalyze()
    k_list, k_doc = analyzer.keywordExtration(q)
    print(k_list)
    result = analyzer.similarityRanking(k_list, ["test test hi hello check checking run ran runner"])
    print(result)