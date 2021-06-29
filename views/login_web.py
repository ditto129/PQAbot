from flask import Blueprint, render_template
#from flask_security import login_required

login_web = Blueprint("login_web", __name__)
GOOGLE_OAUTH2_CLIENT_ID = '417777300686-0vp7be6826583nc16qjiqkfusp39hjrh.apps.googleusercontent.com'

@login_web.route("/login", methods=["GET", "POST"])
def login():
    return render_template('login.html')
