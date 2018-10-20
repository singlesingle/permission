# coding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
from permission.model.user_dao import UserDao

class UserService(object):

    def user_list(self):
        user_dao = UserDao()
        ret = []
        user_list = user_dao.user_list()
        for user in user_list:
            tmp = {}
            tmp['name'] = user['name']
            tmp['phone'] = user['phone']
            if user['role_id'] == '1':
                tmp['role'] = '管理员'
            elif user['role_id'] == '2':
                tmp['role'] = '总监'
            elif user['role_id'] == '3':
                tmp['role'] = '文案人员'
            ret.append(tmp)
        return ret

    def add_user(self, fid, name, role_id, phone):
        user_dao = UserDao()
        add_ret = user_dao.add_user(fid, name, role_id, phone)
        return add_ret