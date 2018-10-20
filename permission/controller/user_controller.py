from django.shortcuts import render
from django.http import HttpResponse
from permission.service.user_service import UserService


def list(request):
    user_service = UserService()
    user_list = user_service.user_list()
    context = {}
    context['user_list'] = user_list
    context['page_topo'] = 'user'
    print user_list
    return render(request, 'user/list.html', context)

def add(request):
    params = request.POST
    name = params['name']
    phone = params['phone']
    role_id = params['role_id']
    user_service = UserService()
    ret = user_service.add_user(0, name, role_id, phone)
    if ret:
        return HttpResponse("success")
    else:
        return HttpResponse("fail")