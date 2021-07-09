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


def PSAbot():
    return render_template("menuBar.html")
