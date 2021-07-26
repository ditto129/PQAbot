# --- flask --- #
from flask import Blueprint, request, jsonify
#from flask_security import logout_user, login_required

# --- our models ---- #
from models import faq_data

faq_api = Blueprint('faq_api', __name__)

# 調整更新週期
@faq_api.route('/adjust_faq_update', methods=['POST'])
def adjust_faq_update():
    data = request.get_json()
    try:
        setting_dict = {
            'data_number':data['num'],
            'update_cycle':data['cycle']
        } 
        faq_data.adjust_update_cycle(setting_dict['data_number'],setting_dict['update_cycle'])
    except Exception as e :
        setting_dict = {"error" : e.__class__.__name__ + ":" +e.args[0]}
        print("錯誤訊息: ", e)
    return jsonify(setting_dict)