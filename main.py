host="0.0.0.0",#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar 15 16:44:08 2021

@author: linxiangling
"""

#from flask import Flask
#from flask import render_template

#app = Flask(__name__)
#@app.route("/")
#def hello():
#    return render_template('test.html')
#if __name__ == "__main__":
#    app.run(host="0.0.0.0", port=55001)

from flask import Flask
#from flask_apscheduler import APScheduler
#from flask_security import Security
from flask_cors import CORS
#import models
from views import register_blueprint
#from lib import config
# --- login --- #
from os import urandom
from models.PSAbotLoginManager import PSAbotLoginManager,UserModel
# --- encryption --- #
from models.RsaTool import RsaTool,rsa_setup
""" associated tags """
from datetime import date
import schedule
import time
from models import inner_post, tag

def create_app():
    app = Flask(__name__)
    app.jinja_env.auto_reload = True
    app.config['SECRET_KEY'] = urandom(24).hex()
    #app.config.from_object(config.Config())
    CORS(app)
    # models setup
    #models.setup(app)
    ''' --- login manager --- '''
    login_manager = PSAbotLoginManager(app)
    @login_manager.user_loader
    def user_loader(user_id):  
        user_now = UserModel(user_id)   
        return user_now
    ''' --- 使用者資料加密 --- '''
    # 要到models/RsaTool 更改path再使用
    # rsa_setup()
    ''' ---------------------- '''
    # register app
    register_blueprint(app)
    return app


  
    


#def refresh_schedule():
#    models.reschedule.refresh_schedule()

#檢查是否新增新標籤
def check_associated_tag():
    if date.today().day != 1:
        return
    new=inner_post.check_associated_tag() #tuple list
    for i in new:
        associated_tag_id=tag.add_new_associated_tag(i)
        tag.add_child_associated(i, associated_tag_id)
    
if __name__ == "__main__":
    # scheduler=APScheduler()
    app = create_app()
    
    # scheduler.init_app(app)
    # scheduler.start()
    app.run(host='0.0.0.0', port=55001)
    """ 每個月一號的0:00檢查是否新增 associated tag """
    schedule.every().day.at("02:00").do(check_associated_tag)
    while True:
        schedule.run_pending()
        time.sleep(1)

#"192.168.111.128",port=55001



