$(document).ready(function() {
    function format(state) {
        return state.id + "<span class='select-info'>("+ state.text + ")</span>";
    }

    $('#grid').kendoGrid({
        scrollable: false,
        dataBound: function(e) {
            $('#grid').css('opacity', '1')
        }
    });
    var grid = $('#grid').data('kendoGrid'),
        wrapper = grid.wrapper;            //获取grid;
    wrapper.find('.k-grid-toolbar').on('click.kendoGrid', '.k-grid-test', function(e){
        window.location.href = '/app/newapp';
    });

    $('.c-searchyw-delete').click(function(e) {
        var gridBatDel = dialog({
            title: '确认',
            width: 250,
            content: '是否删除选中业务',
            okValue: '确定',
            cancelValue: '取消',
            ok: function (){
                var tr = $(e.target).closest('tr');
                var appId = tr.find('.ApplicationID').val();
                $.post('/app/delete',
                    { ApplicationID : appId }
                    ,function(result) {
                        re = $.parseJSON(result);
                        if(re.success == false) {
                            return showWindows(re.errInfo, 'notice');
                        } else {
                            showWindows('删除成功', 'success');
                            tr.remove();
                        }
                    });
            },
            cancel: function () {
            }
        });
        gridBatDel.showModal();
    })

    $('.c-searchyw-save').click(function(){
        var save = this;
        var tr = $(this).closest('tr');
        var nameDom = tr.find('.business_name');
        var bussiName = $.trim(nameDom.find('input').val());
        var operaerVal = tr.find('.operaer').select2('val');
        var selectdata  = tr.find('.operaer').select2('data');
        operaerVal.sort();
        $.unique(operaerVal);
        var appId = tr.find('.ApplicationID').val();
        var operaDom = tr.find('.operaer');
        if((bussiName.length> 30) || (bussiName.length== 0)) {
            var diaCopyMsg = dialog({
                quickClose: true,
                align: 'left',
                padding:'5px 5px 5px 10px',
                skin: 'c-Popuplayer-remind-left',
                content: '<span style="color:#fff">业务名称不合法</span>'
            });
            diaCopyMsg.show(tr.find('.business_name').find('input').get(0));
            return ;
        }
        if(operaerVal.length==0) {
            var diaCopyMsg = dialog({
                quickClose: true,
                align: 'left',
                padding:'5px 5px 5px 10px',
                skin: 'c-Popuplayer-remind-left',
                content: '<span style="color:#fff">请配置运维人员</span>'
            });
            diaCopyMsg.show(tr.find('.select2-container-multi input').get(0));
            return ;
        }
        if(operaerVal.length >24) {
            var diaCopyMsg = dialog({
                quickClose: true,
                align: 'left',
                padding:'5px 5px 5px 10px',
                skin: 'c-Popuplayer-remind-left',
                content: '<span style="color:#fff">请配置24个以下运维人员</span>'
            });
            diaCopyMsg.show(tr.find('.select2-container-multi input').get(0));
            return ;
        }
        $.post("/app/edit",
            {ApplicationName:bussiName, Maintainers:operaerVal.join(';'), ApplicationID:appId}
            ,function(result) {
                rere = $.parseJSON(result);
                if(rere.success == false) {
                    return showWindows(rere.errInfo,'notice');
                    return;
                } else {
                    var selectArr = [];
                    for(var i in selectdata) {
                        selectArr.push(selectdata[i].id +'('+selectdata[i].text+')');
                    }
                    var disName = selectArr.join(";");
                    showWindows('修改成功','success');
                    $(save).hide();
                    $(save).siblings().filter('a[name="edits"]').show();
                    $(save).siblings().filter('a[name="deletes"]').show();
                    $(save).siblings().filter('a[name="cancels"]').hide();
                    var maintainers = tr.find('.Maintainers').val();
                    tr.find('.business_name').html(bussiName);
                    tr.find('.ApplicationName').val(bussiName);
                    tr.find('.operaer').html(disName);
                    tr.find('.Maintainers').val(disName);
                }
            });
    })

    $('.c-searchyw-edit').click(function(){
        var tr = $(this).closest('tr');
        $(this).hide();
        $(this).siblings().filter('a[name="deletes"]').hide();
        $(this).siblings().filter('a[name="saves"]').show();
        $(this).siblings().filter('a[name="cancels"]').show();
        var busiVal = tr.find('.business_name').text();        //业务名称值
        var operaerVal = tr.find('.operaer').text();        //运维人员值
        var arr = (operaerVal).split(";");
        var arrcp = new Array();
        for(var i in arr) {
            var userArr = arr[i].split("(")
            arrcp.push(userArr[0]);
        }
        var selectHtml ='';
        $.post("/app/getMaintainers",function(result) {
            var reval = $.parseJSON(result);
            var selectHtml2 = '';
            var data = new Array();
            if(reval.success != false)
            {
                var uinlist = $.parseJSON(result).uinList;
                var userNameList = $.parseJSON(result).userNameList;
                for(var i=0; i < uinlist.length; i++){
                    var ud = { id: uinlist[i], text: userNameList[i] };
                    data.push(ud);
                }
            }
            tr.find('.operaer').select2({
                placeholder: '选择运维人员',
                allowClear: true,
                data: data,
                multiple: true,
                allowClear: true,
                formatResult: format,
                formatSelection: format
            }).select2('val', arrcp);
        });
        tr.find('.business_name').html('<input type="text" value="'+ busiVal +'" style="width:100%;height:36px;"  class="k-input k-textbox business_name_input">');
        tr.find(".business_name .k-input").attr('placeholder','请输入业务名');
        tr.find(".business_name .k-input").attr('maxlength', '30');
    })

    $('.c-searchyw-cancel').click(function(){
        var tr = $(this).closest('tr');
        var appName = tr.find('.ApplicationName').val();
        var maintainers = tr.find('.Maintainers').val();
        tr.find('.business_name').html(appName);
        tr.find('.operaer').html(maintainers);
        $(this).hide();
        $(this).siblings().filter('a[name="edits"]').show();
        $(this).siblings().filter('a[name="deletes"]').show();
        $(this).siblings().filter('a[name="saves"]').hide();
    })


});
