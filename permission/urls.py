"""permission URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from controller import user_controller
from controller import role_controller
from controller import permission_controller
import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = [
    url(r'^page/user/list', user_controller.list),
    url(r'^page/role/list', role_controller.list),
    url(r'^page/permission/list', permission_controller.list),
    url(r'^api/user/add', user_controller.add),
    url(r'^api/role/add', role_controller.add),
    url(r'^api/permission/add', permission_controller.add),
]
urlpatterns += staticfiles_urlpatterns()
