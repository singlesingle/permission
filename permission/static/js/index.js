window.cookie = {
    get : function(name){
        if(document.cookie.length>0){
            name += '=';
            var allCookie = document.cookie;
            var startIndex = allCookie.indexOf(name);
            if(startIndex > -1) {
                if(startIndex > 1){
                    name = '; '+name;
                    startIndex = allCookie.indexOf(name)+name.length;
                }else{
                    startIndex = startIndex+name.length;
                }
            }else{
                return '';
            }
            var endIndex = allCookie.indexOf(';', startIndex);
            if(endIndex === -1){
                endIndex = document.cookie.length;
            }
            var value = decodeURIComponent(allCookie.substring(startIndex, endIndex));
            return value;
        }

        return '';
    },

    set : function(name, value, expires){
        var exdate = new Date();
        if(expires!=null){
            exdate.setTime(exdate.getTime() + expires*1000);
        }
        document.cookie = name +'='+ encodeURIComponent(value) + (expires==null ? ';path=/' : ';expires='+exdate.toUTCString()+';path=/');
    }
};

window.showWindows = function(msg, level) {      //代码提示框
    if(level=='success') {
        var d = dialog({
            width: 160,
            content: '<div class="c-dialogdiv2"><i class="c-dialogimg-success"></i>' + msg + '</div>'
        });
        d.show();
        setTimeout(function(){d.close();}, 1000);
    } else if(level =='error') {
        var d = dialog({
            title:'错误',
            width:300,
            height:45,
            okValue:"确定",
            ok:function(){},
            content: '<div class="c-dialogdiv2"><i class="c-dialogimg-failure"></i>' + msg + '</div>'
        });
        d.showModal();
    }
    else {
        var d = dialog({
            title:'警告',
            width:300,
            height:45,
            okValue:"确定",
            ok:function(){},
            content: '<div class="c-dialogdiv2"><i class="c-dialogimg-prompt"></i>' + msg + '</div>'
        });
        d.showModal();
    }
}



$(document).ready(function(){

    /**鼠标点击存储cookie*/
    $('.c-sidebar-toggle').on('click',function(){
        var className = $('body').prop('class');
        var isCollapse = className.indexOf('sidebar-collapse') == -1 ? true:false;
        if(isCollapse){
            cookie.set('isCollapse',1);
        }else{
            cookie.set('isCollapse',0);
        }
    });

});