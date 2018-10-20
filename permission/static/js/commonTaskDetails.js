$(function() {
    var privateHostQuickImport = {
        init: function() {
            this.varTable();
            this.tmpEdit();
        },
        tmpEdit: function() {
            //点击.empty开始新建
            $('.empty').click(function(event) {
                var newTr = $($('#tpl_box').html());
                var newInputs = newTr.find('.operatorSelect');
                $(newInputs).select2({
                        placeholder:'请选择',
                        data:window.userList,
                        formatResult:function format(state) {
                        return state.id ? state.id + "<span class='select-info'>(" + state.text + ")</span>" : state.text;
                    },
                    formatSelection:function format(state) {
                        return state.id ? state.id + "<span class='select-info'>(" + state.text + ")</span>" : state.text;
                    }
                }).select2('val','');
                newTr.insertAfter($(this)).addClass('tmp-row');
                $(this).attr('class', 'empty hide');
            });
            // 模版操作
            $('.template-var:not(.disabled)').on('mouseenter', 'tr', function() {
                $(this).addClass('tmp-cur');
            })
            $('.template-var:not(.disabled)').on('mouseleave', 'tr', function() {
                $(this).removeClass('tmp-cur');
            })
            // 添加一个模版变量
            $('.importfast-form').on('click', '.tmp-edit-add', function(event) {
                var flag = true;
                $(".tmp-row .template-var-tr").each(function(i){
                        if ($(this).children('input').val() == '') {
                            $(this).children('input').focus();
                            $(this).children('input').tooltip('show');
                            flag=false;
                            return false;
                        }
                });
                if(flag){
                    var thisTr = $(this).closest('tr');
                    var newTr = $($('#tpl_box').html());
                    var newInputs = newTr.find('.operatorSelect');
                    $(newInputs).select2({
                            placeholder:'请选择',
                            data:window.userList,
                            formatResult:function format(state) {
                            return state.id ? state.id + "<span class='select-info'>(" + state.text + ")</span>" : state.text;
                        },
                        formatSelection:function format(state) {
                            return state.id ? state.id + "<span class='select-info'>(" + state.text + ")</span>" : state.text;
                        }
                    }).select2('val','');
                    newTr.insertAfter(thisTr).addClass('tmp-cur tmp-row').find('input').eq(0).focus();
                }
            });
            // 删除一个变量
            $('.template-var').on('click', '.tmp-edit-close', function() {
                _this = $(this).closest('tr');
                if (_this.siblings('tr').length == 2) {
                    $('.empty').removeClass('hide');
                };
                _this.remove();
            });
            // 工具提示
            $('.template-var').on('blur', 'input', function() {
                if ($(this).parent().hasClass('InnerIP')) {
                    // 验证名称
                    if ($(this).val() == '') {
                        $(this).focus();
                        $(this).tooltip('show');
                        return false;
                    } else {
                        $(this).tooltip('destroy');
                    }
                };
            });
            $('.save').on('click', function(event) {
                var flag = true;
                var haveHostFlag = false;
                var param = new Array();
                var ipaddr = new Array();
                var zichanbianhao = new Array();
                var sn = new Array();
                var manager = new Array();
                $(".tmp-row .ipaddress").each(function(i){
                    if($(this).hasClass('ipaddress')){
                        if($(this).children('input').val().trim() == '') {
                            $(this).children('input').focus();
                            $(this).children('input').tooltip('show');
                            flag=false;
                        }else{
                            haveHostFlag = true;
                            ipaddr.push($(this).children('input').val().trim());
                        }
                    }
                });

                if(!flag){
                    return false;
                }

                $(".tmp-row .资产编号").each(function(i){
                    if($(this).hasClass('资产编号')){
                        if($(this).children('input').val().trim() == '') {
                            $(this).children('input').focus();
                            $(this).children('input').tooltip('show');
                            flag=false;
                        }else{
                            haveHostFlag = true;
                            zichanbianhao.push($(this).children('input').val().trim());
                        }
                    }
                });

                if(!flag){
                    return false;
                }

                $(".tmp-row .sn").each(function(i){
                    if($(this).hasClass('sn')){
                        if($(this).children('input').val().trim() == '') {
                            $(this).children('input').focus();
                            $(this).children('input').tooltip('show');
                            flag=false;
                        }else{
                            haveHostFlag = true;
                            sn.push($(this).children('input').val().trim());
                        }
                    }
                });
                if(!flag){
                    return false;
                }

                $(".tmp-row .管理员").each(function(i){
                    if($(this).hasClass('管理员')){
                        if($(this).children('input').val().trim() == '') {
                            $(this).children('input').focus();
                            $(this).children('input').tooltip('show');
                            flag=false;
                        }else{
                            haveHostFlag = true;
                            manager.push($(this).children('input').val().trim());
                        }
                    }
                });
                if(!flag){
                    return false;
                }

                for (var k = 0, length = ipaddr.length; k < length; k++) {
                    var tmp = {};
                    tmp['ipaddress']=ipaddr[k]  
                    tmp['资产编号']=zichanbianhao[k]  
                    tmp['sn']=sn[k]  
                    tmp['管理员']=manager[k]  
                    param.push(tmp);
                }

                if(!haveHostFlag){
                    $('.modal').modal('hide');
                    var noHostDialog = dialog({
                        title:'确认',
                        width:300,
                        height:50,
                        content: '<div class="c-dialogdiv2"><i class="c-dialogimg-prompt"></i>无主机数据录入！</div>',
                        okValue:"确定",
                        ok:function(){
                        }
                    });

                    noHostDialog.showModal();
                    return false;
                }

                if(flag){
                    $.ajax({
                        url:'/api/host/importhost',
                        data:{"req":JSON.stringify(param)},
                        method:'post',
                        dataType:'json',
                        success:function(data){
                            $('.modal').modal('hide');
                            if(data.success){
                                var d = dialog({
                                    content: '<div class="c-dialogdiv2"><i class="c-dialogimg-success"></i>导入成功!</div>'
                                });
                                d.showModal();
                                setTimeout(function(){
                                    window.location.replace(location.href);
                                }, 2000);
                                return true;
                            }else{
                                var d = dialog({
                                    title:'确认',
                                    width:300,
                                    height:100,
                                    content: '<div class="c-dialogdiv"><i class="c-dialogimg-prompt"></i>'+ data.errInfo +'</div>',
                                    okValue:"确定",
                                    ok:function(){
                                        window.location.replace(location.href);
                                    }
                                });

                                d.showModal();
                                $(".import-error-list").mCustomScrollbar({
                                    theme: "minimal-dark"
                                });
                            }
                        }
                    });
                }
            });
        },
        varTable: function() {
            var varArr = [{InnerIP: "",OuterIP: "","Operator": ""}];
            if (0 == varArr) {
                $('.tmp-datas').find('.empty').removeClass('hide');
            }
            if (varArr.length > 0) {
                var tmpHtml = "";
                for (var i = 0; i < varArr.length; i++) {
                    var v = varArr[i];
                    var node = $('.tmp-demo').clone(true).removeClass('tmp-demo');
                    node.find('.template-var1>input').attr("value",v.InnerIP);
                    node.find('.template-var2>input').attr("value",v.OuterIP);
                    tmpHtml += "<tr class='tmp-row'>" + node.html() + "</tr>";
                };
                $(".tmp-datas").append(tmpHtml);
            }
        }
    };
    privateHostQuickImport.init();
})
