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

class RoleDao(object):

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
        self.table_name = "role"

    def add_role(self, name, introduce):
        cur = self.conn.cursor()
        sql = "insert into %s (name, introduce) values ('%s', '%s')" (self.table_name, name, introduce)
    	ret = cur.execute(sql)
        cur.close()
        self.conn.commit()
        self.conn.close()
        return ret

    # 查询角色列表
    def role_list(self):
        cur = self.conn.cursor()
        sql = "select * from %s" % (self.table_name)
        cur.execute(sql)
        info = cur.fetchall()
        return info