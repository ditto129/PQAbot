# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

import random

class ActionHelloWorld(Action):
    def name(self) -> Text:
        return "ActionHelloWorld"

    def run(self, dispatcher, tracker, domain) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="hello test")
        return []

class exchange(Action):
    # return 要放 action的名稱 「一定要一模一樣」
    def name(self) -> Text:
        return "exchange"

    def run(self, dispatcher, tracker, domain) -> List[Dict[Text, Any]]:
        NT = int(tracker.get_slot("NT"))
        NT = NT*0.035
        dispatcher.utter_message(
            text="美金是"+str(NT),
            json_message = {"res_after": NT, "res_before": tracker.get_slot("NT")}
        )
        return []

class fill_slot(Action):
    def name(self) -> Text:
        return "fill_slot"

    def run(self, dispatcher, tracker, domain) -> List[Dict[Text, Any]]:
        function = tracker.get_slot("function")
        os = tracker.get_slot("os")
        pl = tracker.get_slot("pl")
        if os!=None and pl!=None:
            if "錯誤訊息" in function:
                reply = "請貼上您的錯誤訊息"
            elif "引導式" in function:
                reply = "請描述您遇到的問題"
            else:
                reply = "你的function抓不到"
        elif os == None:
            reply = "請問您使用的是什麼作業系統？<br>若之後要修改，請輸入「我要更改作業系統」"
        else:
            reply = "請問您使用的是什麼程式語言？<br>若之後要修改，請輸入「我要更改程式語言」"
        
        dispatcher.utter_message(text=reply)
        return []

class outer_search(Action):
    def name(self) -> Text:
        return "outer_search"

    def run(self, dispatcher, tracker, domain) -> List[Dict[Text, Any]]:
        testReply=[("https://stackoverflow.com/questions/48714769/python-flask-cors-importerror-no-module-named-flask-cors-raspberry-pi", "Flask-CORS not working for POST, but working for GET"), ("https://stackoverflow.com/questions/25594893/how-to-enable-cors-in-flask", "Solve Cross Origin Resource Sharing with Flask"), ("https://stackoverflow.com/questions/39550920/flask-cors-not-working-for-post-but-working-for-get", "Flask CORS stopped allowing access to resources"), ("https://stackoverflow.com/questions/25594893/how-to-enable-cors-in-flask", "How to enable CORS in flask"), ("https://stackoverflow.com/questions/39029767/flask-cors-and-flask-limiter", "Flask CORS and Flask Limiter")]
        random.shuffle(testReply)
        answer=testReply[0:3]
        reply = "謝謝您的等待～ 以下為搜尋結果<br>"
        for i in range(0, 3):
            reply += ("<br>" + str(i+1) + ". <a href=\"" + answer[i][0] + "\">" + answer[i][1] + "</a>")
        reply += "<br>點選摘要連結可顯示內容。<br><br>是否要繼續搜尋？"
        
        dispatcher.utter_message(text=reply)
        return []
