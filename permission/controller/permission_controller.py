from django.shortcuts import render
from permission.service.permission_service import PermissionService
from django.http import HttpResponse

def list(request):
    permission_service = PermissionService()
    permission_list = permission_service.permission_list()
    context = {}
    context['permission_list'] = permission_list
    context['page_topo'] = 'permission'
    return render(request, 'permission/list.html', context)

def add(request):
    permission_service = PermissionService()
    ret = permission_service.add_permission()
    return HttpResponse("Hello world ! ")