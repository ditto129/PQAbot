from flask_login import UserMixin,current_user
from . import user
from functools import wraps

class UserModel(UserMixin):  
    
    def __init__(self, user_id):
        user_data = user.query_user(user_id)
        self.id = user_data['_id']  # 顏色屬性
        self.role = user_data['role']
    @property
    def is_manager(self):
        return False
    
    
def requires_roles(*roles):
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if current_user.role not in roles:
                # Redirect the user to an unauthorized notice!
                return (current_user.role in roles)
            return f(*args, **kwargs)
        return wrapped
    return wrapper
