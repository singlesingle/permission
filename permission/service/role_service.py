from permission.model.role_dao import RoleDao


class RoleService(object):

    def role_list(self):
        role_dao = RoleDao()
        role_list = role_dao.role_list()
        ret = []
        for role in role_list:
            ret.append(role)
        print ret
        return ret

    def add_role(self, name, introduce):
        role_dao = RoleDao()
        add_ret = role_dao.add_role(name, introduce)
        return add_ret