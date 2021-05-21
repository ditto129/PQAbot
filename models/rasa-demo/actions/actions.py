# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

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
        
class ask_question_or_message(Action):
    # return 要放 action的名稱 「一定要一模一樣」
    def name(self) -> Text:
        return "ask_question_or_message"

    def run(self, dispatcher, tracker, domain) -> List[Dict[Text, Any]]:
        chosen = tracker.get_slot("function")
        if "錯誤訊息" in chosen:
            reply = "請貼上您的錯誤訊息"
        elif "引導式" in chosen:
            reply = "請描述您遇到的問題"
        else:
            reply = "你的function抓不到"
        
        dispatcher.utter_message(text=reply)
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
            reply = "請問您使用的是什麼作業系統？\n若之後要修改，請輸入「我要更改作業系統」"
        else:
            reply = "請問您使用的是什麼程式語言？\n若之後要修改，請輸入「我要更改程式語言」"
        
        dispatcher.utter_message(text=reply)
        return []
