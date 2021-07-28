''' =========== FAQ_DATA_COLLECTION =========== *
- 新增資料 : insert_資料名稱
- 取得資料 : query_資料名稱
- 刪除資料 : remove_資料名稱
- 資料名稱統一，以底線分隔
- 使用collection : _db.FAQ_DATA_COLLECTION
* ========================================'''

from . import _db


# 調整更新週期
def adjust_update_cycle(data_number,update_cycle):
    _db.FAQ_DATA_COLLECTION.update_one({'_id':'faq_settings'},{'$set':{'data_number':data_number,'update_cycle':update_cycle}})

# 取得更新週期
def query_update_cycle():
    return _db.FAQ_DATA_COLLECTION.find_one({'_id':'faq_settings'})

# 取得FAQ列表
# 依標籤取得FAQ列表
# 依字串取得FAQ列表
# 新增單篇FAQ
# 匯入FAQ