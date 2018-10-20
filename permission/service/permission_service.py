# coding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
from permission.model.permission_dao import PermissionDao


class PermissionService(object):

    def permission_list(self):
        permission_dao = PermissionDao()
        permission_list = permission_dao.permission_list()
        for permission in permission_list:
            permission['type'] = PermissionDao.type_to_name[int(permission['type'])]
            if permission['role_id'] == '1':
                permission['role_id'] = '管理员'
            elif permission['role_id'] == '2':
                permission['role_id'] = '总监'
            elif permission['role_id'] == '3':
                permission['role_id'] = '文案人员'
        return permission_list

    def add_permission(self, role_id, type, value):
        permission_dao = PermissionDao()
        add_ret = permission_dao.add_permission(role_id, type, value)
        return add_ret