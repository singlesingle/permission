# coding=utf-8

import MySQLdb
import MySQLdb.cursors
import MySQLdb.converters
import time
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import logging
from django.conf import settings

class PermissionDao(object):

    type = {
        'API接口': 1,
        '应用程序': 2,
        '系统模块': 3,
    }

    type_to_name = {
        1 : 'API接口',
        2 : '应用程序',
        3 : '系统模块',
    }

    def __init__(self):
        conv = MySQLdb.converters.conversions.copy()
        conv[246] = float  # convert decimals to floats
        conv[10] = str  # convert dates to strings
        self.conn = MySQLdb.connect(
            host=settings.DATABASES['default']['HOST'],
            port=int(settings.DATABASES['default']['PORT']),
            user=settings.DATABASES['default']['USER'],
            passwd=settings.DATABASES['default']['PASSWORD'],
            db=settings.DATABASES['default']['NAME'],
            charset= 'utf8',
            cursorclass=MySQLdb.cursors.DictCursor,
            conv=conv
        )
        self.table_name = "permission"

    def add_permission(self, role_id, type, value):
        cur = self.conn.cursor()
        sql = "insert into %s (role_id, `type`, value) values ('%d', '%d', '%s')" % \
              (self.table_name, role_id, type, value)
        ret = cur.execute(sql)
        cur.close()
        self.conn.commit()
        self.conn.close()
        return ret

    def permission_list(self):
        cur = self.conn.cursor()
        sql = "select * from %s" % (self.table_name)
        cur.execute(sql)
        info = cur.fetchall()
        return info