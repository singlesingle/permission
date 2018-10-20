from django.shortcuts import render
from permission.service.role_service import RoleService
from django.http import HttpResponse

def list(request):
    role_service = RoleService()
    role_list = role_service.role_list()
    context = {}
    context['role_list'] = role_list
    context['page_topo'] = 'role'
    return render(request, 'role/list.html', context)

def add(request):
    role_service = RoleService()
    ret = role_service.add_role()
    return HttpResponse("Hello world ! ")