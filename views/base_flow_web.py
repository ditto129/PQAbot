#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr 19 19:04:59 2021

@author: linxiangling
"""

from flask import Blueprint, render_template

base_flow_web=Blueprint('base_flow_web', __name__)

@base_flow_web.route("/base_flow")
def base_flow():
    return render_template("base_flow.html")


@base_flow_web.route("/PSAbot")
def PSAbot():
    return render_template("menuBar.html")

@base_flow_web.route("/Profile")
def Profile():
    return render_template("profile.html")
    
@base_flow_web.route("/profileFrame")
def profileFrame():
    return render_template("profileFrame.html")
    
@base_flow_web.route("postQuestionFrame")
def postQuestionFrame():
    return render_template("postQuestionFrame.html")
    
@base_flow_web.route("/replyQuestionFrame")
def replyQuestionFrame():
    return render_template("replyQuestionFrame.html")
    
@base_flow_web.route("/mySinglePostFrame")
def mySinglePostFrame():
    return render_template("mySinglePostFrame.html")
    
@base_flow_web.route("/otherSingleFrame")
def otherSingleFrame():
    return render_template("otherSingleFrame.html")

@base_flow_web.route("/postRowFrame")
def postRowFrame():
    return render_template("postRowFrame.html")

@base_flow_web.route("/home")
def homeFrame():
    return render_template("home.html")
    
@base_flow_web.route("/summaryFrame")
def summaryFrame():
    return render_template("summary_new.html")
    
#可以用相對路徑嗎？好像不行
@base_flow_web.route("/skillTreeFrame")
def skillTreeFrame():
    return render_template("example.html")

@base_flow_web.route("/editPostFrame")
def editPostFrame():
    return render_template("editPostFrame.html")
    
@base_flow_web.route("/editReplyFrame")
def editReplyFrame():
    return render_template("editReplyFrame.html")
