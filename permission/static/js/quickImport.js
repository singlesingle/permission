$(document).ready(function() {
    /**
    * 其它云kendoGrid配置对象
    * columns：表格对应的所有列
    * dataSource：数据源
    * scrollable：是否可滚动
    * selectable：是否可选。multiple表示可多选，cell表示选中单位为单元格
    * allowCopy：允许ctrl+c复制，分隔符为delimiter
    * filterable：是否可过滤
    * pageable：是否分页
    * change：选中事件处理函数
    * toolbar：工具栏
    */
    var privateKendoGridObj = {
        columns:[
            {field:'checkbox',title:'#',menu:false,width:30,template:'<input type="checkbox" #:data.Checked# value="#:data.HostID#" class="c-grid-checkbox"/>'},
            {field:'ipaddress',title:"ipaddress",filterable:true},
            {field:"资产编号",title:'资产编号',filterable:true},
            {field:"sn",title:'sn',filterable:true},
            {field:"管理员",title:'管理员',filterable:true}
        ],
        dataSource:{
            transport: {
                read: {
                    url: "/api/host/getimporthost",
                    //data:{ApplicationID:cookie.get('defaultAppId'),IsDistributed:false,Source:"3"},
                    data:"",
                    //method:'post',
                    method:'get',
                    dataType:"json"
                }
            },
            pageSize:20,
            serverPaging: false,
            requestStart: function(){
                kendo.ui.progress($("#private").parent(), true);
            },
            requestEnd: function(){
                kendo.ui.progress($("#private").parent(), false);
            },
            schema: {
                data: function (response) {
                    return response.data;
                },
                total: function (response) {
                    if($('.cc_switch_btn').attr('data-fp')=='1'){
                        var text = '未分配('+response.total+')';
                        $('.switch').siblings('.num').text(text);
                    }else if($('.cc_switch_btn').attr('data-fp')=='0'){
                        var text = '已分配('+response.total+')';
                        $('.switch').siblings(".num").text(text);
                    }
                    return response.total;
                }
            }
        },
        selectNum: 0,
        scrollable: true,
        selectable:"multiple cell",
        allowCopy:{delimiter : ';'},
        filterable: false,
        pageable:true,
        resizable:true,
        dataBound:function(e){
            this.selectNum = 0;

            $('.importfast-button').on('click', function(){
                $('.importfast-template-modal').modal();
                return false;
            })
        },
        change: function(e){
            $('.k-grid-delete', '#private').attr('disabled', false);

            var grid = $('#private').data('kendoGrid');
            var selectedRows = grid.select();
            $(selectedRows).closest('tr').find('input').prop('checked', true);
            for(var i=0,len=selectedRows.length; i<len; i++){
                var data = grid.dataItem($(selectedRows[i]).parents('tr'));
                if(data.Checked!='checked'){
                    this.selectNum++;
                    data.Checked = 'checked';
                }
            }
            if(this.selectNum > 0 && $('.cc_switch_btn').attr('data-fp')=='1'){
                $('.k-grid-quickDistribute', '#private').attr('disabled', false);
            }else{
                $('.k-grid-quickDistribute', '#private').attr('disabled',true);
            }
        },
        toolbar: [//头部工具栏kendoToolBar,可以参考ui.toolbar的api
            {text:'入库',name:'quickDistribute',attr:{"href":"javascript:void(0);","disabled":"true"}},
            //{text:'导入主机',template:"<a class=\"k-button\" id=\"importPrivateHostByExcel\" href=\"javascript:void(0);\"><span class=\"\"></span>导入主机</a>"},
            {text:'快速导入',template:"<a class=\"k-button importfast-button\"  data-target=\".importfast-template\" href=\"javascript:void(0);\"><span class=\"\"></span>快速导入</a>"},
            {text:'删除',name:'delete',attr:{"href":"javascript:void(0);","disabled":"true"}},
            //{text:'搜索',template:"<div class=\"c-import-search\"><input id=\"filter-private\" type=\"text\" class=\"form-control pull-left\" placeholder=\"搜索...\" /><i class=\"glyphicon glyphicon-search\"></i></div>"},
            //{text:'切换',template:"<div class=\"c-import-fpBtn\"><div class=\"cc_switch_btn cc_switch_btn_right\" data-fp=\"1\"><img class=\"switch\" src=\"/static/img/cc_switch_btn.png\"/><div class=\"num\">未分配</div></div></div>"}
        ]
    };

    /*初始化其它云表格*/
    $("#private").kendoGrid(privateKendoGridObj);

    $('.importfast-button').on('click', function(){
        $('.importfast-template-modal').modal();
        return false;
    });

    $('.cc_switch_btn .switch').click(function(){
        if($('.cc_switch_btn').attr('data-fp')=='1'){
            $('.cc_switch_btn').removeClass('cc_switch_btn_right').addClass('cc_switch_btn_left');
            $('.cc_switch_btn').attr('data-fp',0);
            var state = true;
            $('.k-grid-delete,.k-grid-quickDistribute', '#private').attr('disabled', true);
            $('.k-grid-delete', '#private').hide();
        }else if($('.cc_switch_btn').attr('data-fp')=='0'){
            $('.cc_switch_btn').removeClass('cc_switch_btn_left').addClass('cc_switch_btn_right');
            $('.cc_switch_btn').attr('data-fp',1);
            $('.k-grid-delete', '#private').show();
            var state = false;
        }

        var grid = $('#private').data('kendoGrid');
        grid.thead.find('input').attr('checked', false);
        grid.destroy();
        $('#filter-private').data('data',{});
        var gridObj = eval('privateKendoGridObj');
        gridObj.dataSource.transport.read.data.IsDistributed = state;
        $("#private").kendoGrid(gridObj);
        grid = $("#private").data('kendoGrid');
        grid.refresh();
        $('#filter-private').val('');

    });

    (function(){

        /*标签点击事件*/
        $('.nav-tabs').on('click', function(e){
            if($(e.target).attr('href')){
                cookie.set('quick_destribute_current_tab', $(e.target).attr('href').replace('#',''));
            }
        });

        /*表格表头添加checkbox*/
        var type = ['private'];
        for(var i=0,len=type.length; i<len; i++){
            var checkAll = $('<input type="checkbox" data-field="checkAll"/>');
            $('#'+type[i]).find('th[data-field=checkbox]').empty().append(checkAll);
        }
    })();

    /**
    * 表格工具栏的切换按钮
    * size：按钮大小
    * labelWidth：切换按钮的label宽度
    * onText：切换按钮on状态的文字
    * offText：切换按钮off状态的文字
    * onSwitchChange：状态切换时间处理函数
    */
    $(".host-state-switcher").bootstrapSwitch({
        size: 'small',
        labelWidth:'60px',
        onText: '已分配',
        offText: '未分配',
        onSwitchChange: function(e, state){
            var id = 'private';
            var grid = $('#'+id).data('kendoGrid');
            grid.thead.find('input').attr('checked', false);
            grid.destroy();
            var gridObj = eval(id+'KendoGridObj');
            gridObj.dataSource.transport.read.data.IsDistributed = state;
            $('#'+id).kendoGrid(gridObj);
            grid = $('#'+id).data('kendoGrid');
            grid.refresh();
            $('#filter-'+id).data('data',{});
            if(state == true) {
                $('.k-grid-quickDistribute', '#'+id).attr('title', '配置平台禁止跨业务分配主机，如果实在要用，请联系原主机业务的运维同学上交后再分配');
            }
            else{
                $('.k-grid-quickDistribute', '#'+id).removeAttr('title');
            }

            $('.k-grid-delete,.k-grid-quickDistribute', '#'+id).attr('disabled', true);
            if(state){
                $('.k-grid-delete', '#'+id).hide();
            }else{
                $('.k-grid-delete', '#'+id).show();
            }

            $('#filter-'+id).val('');
        }
    });

    /**
    * 表头搜索框输入时间处理函数
    * 支持所有字段的搜索，字段之间逻辑关系为or，搜索方式为contains，即包含
    */
    $('#filter-private').on('keyup', function(e){
        var type = $(e.target).attr('id').split('-').pop();
        var grid = $('#'+type).data('kendoGrid');
        if(typeof JSON=='undefined'){
            $('head').append('<script type="text/javascript" src="/static/js/json2.js"></script>');
        }

        if($.isEmptyObject($(e.target).data('data'))){
            var data = grid.dataSource.data();
            $(e.target).data('data', data);
        }else{
            var data = $(e.target).data('data');
        }
        var d = JSON.parse(JSON.stringify(data));
        for(var i in d){
            d[i].Checked = '';
        }
        grid.dataSource.data(d);
        grid.refresh();
        grid.thead.find('input[type=checkbox]').prop('checked', false);

        filter = {logic: "or", filters: []};
        $searchValue = $(e.target).val();
        if ($searchValue) {
            $.each(grid.columns, function (key, column) {
                if (column.filterable) {
                    filter.filters.push({field: column.field, operator: "contains", value: $searchValue});
                }
            });
        }

        grid.dataSource.options.serverFiltering = false;
        grid.dataSource.filter(filter);
        grid.selectNum = 0;
        var query = new kendo.data.Query(grid.dataSource.data());

        if($('.cc_switch_btn').attr('data-fp')=='1'){
            var text = '未分配('+query.filter(filter).data.length+')';
            $('.switch').siblings('.num').text(text);
        }else if($('.cc_switch_btn').attr('data-fp')=='0'){
            $('.cc_switch_btn').removeClass('cc_switch_btn_right').addClass('cc_switch_btn_left');
            var text = '已分配('+query.filter(filter).data.length+')';
            $('.switch').siblings(".num").text(text);
        }
    });

    /**
    * 表头工具栏“分配至”点击事件处理函数
    */
    $('.k-grid-quickDistribute').on('click', function(e){
        if($(e.target).attr('disabled')=='disabled'){
            return false;
        }

        var id = $(e.target).parents('.tab-pane').attr('id');
        var grid = $('#'+id).data('kendoGrid');
        var data = grid.dataSource.data();
        if(typeof JSON=='undefined'){
            $('head').append('<script type="text/javascript" src="/static/js/json2.js"></script>');
        }
        var d = JSON.parse(JSON.stringify(data));
        var hostId = [];
        for(var i=0,len=d.length; i<len; i++){
            if(d[i].Checked==='checked'){
                hostId.push(d[i]);
            }
        }

        if(hostId.length===0){
            var noHostSelectDialog = dialog({
                content: '<div class="c-dialogdiv2"><i class="c-dialogimg-prompt"></i>请选择主机</div>'
            });
            noHostSelectDialog.show();
            setTimeout(function () {
                noHostSelectDialog.close().remove();
            }, 2000);
            return false;
        }

        var param = {};
        param['req'] = JSON.stringify(hostId);

        var options = {
            title:'确认',
            width:310,
            content: '确认要将已选择服务器导入CMDB ?',
            okValue:"继续",
            cancelValue:"我再想想",
            ok:function (){
                var d = dialog({
                    content: '<div class="c-dialogdiv2"><img class="c-dialogimg-loading" src="/static/img/loading_2_24x24.gif"></img>正在导入...</div>'
                });
                d.showModal();

                $.ajax({
                    dialog:d,
                    url:'/api/host/quickdistribute',
                    data:param,
                    method:'post',
                    dataType:'json',
                    success:function(response){
                        this.dialog.close().remove();
                        var content = response.success==true ? '<i class="c-dialogimg-success"></i>'+response.message : '<i class="c-dialogimg-prompt"></i>'+response.errInfo;
                        var d = dialog({
                            content: '<div class="c-dialogdiv2">'+content+'</div>'
                        });
                        d.showModal();
                        setTimeout(function() {
                            d.close().remove();
                            window.location.reload();
                        }, 2500);
                        return true;
                    }
                });
            },
            cancel:function(){}
        };

        /*
        if(IsDistributed){
            options.content = '当前操作会将已勾选的<i class="redFont ">'+ hostId.length +'</i>台主机分配至<i data-toggle="tooltip" data-placement="bottom" title="默认分配至当前业务，在右上角切换业务可分配至其它业务" class="redFont-e">'+ cookie.get('defaultAppName') +'</i>的空闲机池，确认继续？';
        }
        */

        var quickDistributeDialog = dialog(options);
        quickDistributeDialog.showModal();
        $('.redFont-e').tooltip();
        return true;
    });

    /**
    * 表格第一列复选框勾选事件处理函数
    */
    $('#private').on('change', 'input[type=checkbox]', function(e){
        var type = $(e.target).parents('.tab-pane').attr('id');
        var grid = $('#'+type).data('kendoGrid');
        var filter = grid.dataSource.filter();

        if($(e.target).attr('data-field')==='checkAll'){
            var checkAll = $(e.target).prop('checked');
            if($.isEmptyObject($('#filter-'+type).data('data'))){
                var allData = grid.dataSource.data();
                $(e.target).data('data', allData);
            }else{
                var allData = $('#filter-'+type).data('data');
            }

            if(typeof JSON=='undefined'){
                $('head').append('<script type="text/javascript" src="/static/js/json2.js"></script>');
            }
            var query = new kendo.data.Query(allData);
            var data = query.filter(filter).data;
            var d = JSON.parse(JSON.stringify(data));
            for(var i in d){
                d[i].Checked = checkAll ? 'checked' : '';
            }

            grid.dataSource.data(d);
            grid.refresh();

            grid.selectNum = checkAll ? d.length : 0;
        }else{
            var checked = $(e.target).prop('checked');
            var data = grid.dataItem($(e.target).closest('tr'));
            data.Checked = checked ? 'checked' : '';

            if(checked){
                grid.selectNum++;
            }else{
                grid.selectNum--;
            }

            grid.thead.find('input').prop('checked', grid.selectNum === grid.dataSource._total);
        }

        if(grid.selectNum === grid.dataSource._total){
            var selectAllDialog = dialog({
                content: '<div class="c-dialogdiv2"><i class="c-dialogimg-success"></i>全选<i class="redFont">'+grid.selectNum+'</i>台主机</div>'
            });
            selectAllDialog.show();
            setTimeout(function(){selectAllDialog.close().remove();}, 2000);
        }

        /*
        var quickDistribute = $('.k-grid-quickDistribute', '#'+type);
        var gridObj = eval(type+'KendoGridObj');
        if(gridObj.dataSource.transport.read.data.IsDistributed == false){
            quickDistribute.attr('disabled', grid.selectNum>0 ? false : true);
        }else{
            quickDistribute.attr('disabled', true);
        }
        */
        $('.k-grid-delete', '#'+type).attr('disabled', grid.selectNum>0 ? false : true);
        $('.k-grid-quickDistribute', '#'+type).attr('disabled', grid.selectNum>0 ? false : true);
    });

    
    /**
    * 表头工具栏“删除”按钮点击事件处理函数
    * 将从其它云，利用excel导入的主机从配置平台彻底删除
    */
    $(".k-grid-delete").on('click', function(e){
        if($(e.target).attr('disabled')=='disabled'){
            return false;
        }

        var param = {};
        var type = $(e.target).parents('.tab-pane').attr('id');
        var grid = $('#'+type).data('kendoGrid');
        var data = grid.dataSource.data();
        if(typeof JSON=='undefined'){
            $('head').append('<script type="text/javascript" src="/static/js/json2.js"></script>');
        }
        var d = JSON.parse(JSON.stringify(data));
        var hostId = [];
        var appId = [];
        for(var i=0,len=d.length; i<len; i++){
            if(d[i].Checked==='checked'){
                hostId.push(d[i].资产编号);
            }
        }

        if(hostId.length==0){
            var noHostSelectDialog = dialog({
                content: '<div class="c-dialogdiv2"><i class="c-dialogimg-prompt"></i>请选择主机</div>'
            });
            noHostSelectDialog.show();
            setTimeout(function () {
                noHostSelectDialog.close().remove();
            }, 2000);
            return false;
        }

        param['zcbh'] = hostId.join(',');
        var options = {
            title:'确认',
            width:300,
            content: '您勾选的<i class="redFont">' + hostId.length + '</i>台主机即将离开配置平台，确认是否继续？',
            okValue:"继续",
            cancelValue:"我再想想",
            ok:function (){
                var d = dialog({
                    content: '<div class="c-dialogdiv2"><img class="c-dialogimg-loading" src="/static/img/loading_2_24x24.gif"></img>正在删除...</div>'
                });
                d.showModal();

                $.ajax({
                    dialog:d,
                    url:'/api/host/deleteimporthost',
                    data:param,
                    method:'post',
                    dataType:'json',
                    success:function(response){
                        this.dialog.close().remove();
                        if(response.success){
                            var distributeHostDialog = dialog({
                                title:'提示',
                                width:300,
                                height:50,
                                content: '<div class="c-dialogdiv"><i class="c-dialogimg-success"></i>删除成功!</div>',
                                okValue:"确定",
                                ok:function (){
                                    location.href = '/page/host/import';
                                }
                            });

                            distributeHostDialog.showModal();
                            return true;
                        }else{
                            var content = response.success==true ? '<i class="c-dialogimg-success"></i>'+response.message : '<i class="c-dialogimg-prompt"></i>'+response.message;
                            var d = dialog({
                                width: 150,
                                content: '<div class="c-dialogdiv2">'+content+'</div>'
                            });
                            d.showModal();
                            setTimeout(function() {
                                d.close().remove();
                                window.location.reload();
                            }, 2500);
                        }
                        return true;
                    }
                });
            },
            cancel:function(){}
        };

        var quickDistributeDialog = dialog(options);
        quickDistributeDialog.showModal();

        return true;
    });

    $(document.body).on('click', '#user_guide_import_private', function(e){
        d.close().remove();step1();
    });


    $('.import-page-mask').click(function(e){
        $(this).hide();
    });

    $('#importOtherHost').click(function(){
        cookie.set('quick_destribute_current_tab', 'private');
        cookie.set('quickimport_user_guide_step', 1);
        step1();
    });

    // 导入私有云机器
    $('#importPrivateHostByExcel').on('click',function (e){
        var importPrivateHost = dialog({
                title:'导入主机',
                width:530,
                content: '<div class="pt10">'+
                         '<form action="/host/getImportPrivateHostTableFieldsByExcel" id="upload_form" enctype="multipart/form-data" method="post" target="upload_proxy" style="display:inline-block;">'+
                         '<lable><span class="c-gridinputmust pr10">*</span>请选择导入文件：</lable>'+
                         '<a class="k-button king-btn-mini king-file-btn filebox">选择文件'+
                         '<input type="file" id="importPrivateHost" name="importPrivateHost">'+
                         '</a>'+
                         '<span class="import-file-name ml15"></span>'+
                         '<p style="color:#666;padding:10px 0 0 5px;"></p>'+
                         '<p class="">温馨提示：<br><br>1.文件类型支持xls、xlsx、csv;  <br><br>2.格式如下示例，其中<lable class="redFont">内网IP</lable>是必填项,其它的均非必填且可以自定义;<br><br>3.参考文件  <a href="/static/excel/importhost.xlsx"><i class="fa fa-download"></i>  importhost.xlsx</a><br><br><img src="/static/img/import.jpg"/></p>'+
                         '</form>'+
                         '</div>',
                okValue:"导入",
                cancelValue:"关闭",
                skin:'dia-grid-batDel',
                ok:function (){
                    var file = $('#importPrivateHost').val();
                    if(file){
                        $("#upload_form").submit();
                    }else{
                        var noFileSelectDialog = dialog({
                            content: '<div class="c-dialogdiv2"><i class="c-dialogimg-prompt"></i>请选择文件</div>'
                        });
                        noFileSelectDialog.show();
                        setTimeout(function () {
                            noFileSelectDialog.close().remove();
                        }, 2000);
                        return false;
                    }
                    
                    uploadDialog = dialog({
                        content: '<div class="c-dialogdiv2"><img class="c-dialogimg-loading" src="/static/img/loading_2_24x24.gif"></img>正在导入...</div>'
                    });
                    uploadDialog.showModal();
                    setTimeout(function(){
                        //clearUpload($(e.target).attr('id'));
                    },500);
                }
            });
        importPrivateHost.showModal();
        $('#importPrivateHost').on('change', function(){ 
          if (!$('.import-file-name').text($('#importPrivateHost').val().split('\\')[$('#importPrivateHost').val().split('\\').length-1])) {
               $('.import-file-name').text($('#importPrivateHost').val().split('/')[$('#importPrivateHost').val().split('/').length-1])
          };
        });
    })

});


/**
* 重置上传表单，防止相同文件上传没反应
*/
function clearUpload(id){
    $("#"+id).parents('form').submit().end().remove();//移除原来的
    $("<input/>").attr("name",id).attr("id",id).attr("type","file").appendTo(".filebox");//添加新的
}

/**
* 导入主机回调函数
* 负责页面显示成功or失败的提示
*/
function uploadCallback(data){
    uploadDialog.close().remove();
    if(data.success){
        var d = dialog({
            content: '<div class="c-dialogdiv2"><i class="c-dialogimg-success"></i>'+ data.errInfo +'</div>'
        });
        d.showModal();
        setTimeout(function(){
            window.location.replace(location.href);
        }, 2000);
    }else{
        var d = dialog({
            title:'确认',
            width:300,
            content: '<div class="c-dialogdiv2"><i class="c-dialogimg-prompt"></i>'+ data.errInfo +'</div>',
            okValue:"确定",
            ok:function(){
                window.location.reload();
            }
        });

        d.showModal();
        $(".import-error-list").mCustomScrollbar({
            theme: "minimal-dark" //设置风格
        });
    }
}

/**
* 导入主机回调函数
* 负责页面显示成功or失败的提示
*/
function uploadCallbackToHostField(data){
    uploadDialog.close().remove();

    if(data.success){
        var titles = data.keys;
        var select2Arr = JSON.parse(JSON.stringify(data.fields));
        var select2data = JSON.parse(JSON.stringify(data.fields));
        var readTilte_html='';
        $.each(titles,function(i,e) {
            readTilte_html += '<div class="row import_readdialoga">'+
                            '   <div class="col-3">'+
                            '       <input type="text" class="form-control tableHeader" style="width:100%;" readOnly="true" value='+e.name+' >'+
                            '   </div>'+
                            '   <div class="col-5 user-radio">'+
                            '       <label><input type="radio" name="'+e.name+'" class="user-noimport" value="noimport" checked="checked">不导入</label>'+
                            '       <label><input type="radio" name="'+e.name+'" class="user-filter" value="select">映射已有字段</label>'+
                            '       <label><input type="radio" name="'+e.name+'" class="user-defined" value="customer">自定义</label>'+
                            '   </div>'+
                            '   <div class="col-4">'+
                            '       <input type="text" name="'+e.name+'_noimport" class="form-control user-noimport-input" readOnly="true" style="width:100%;display:block;">'+
                            '       <input type="text" name="'+e.name+'_select" class="select2_box user-filter-input" style="width:100%;display:none;">'+
                            '       <input type="text" name="'+e.name+'_customer" class="form-control user-defined-input" style="width:100%;display:none;">'+
                            '   </div>'+
                            '</div>';
        });
        var importPrivateHost = dialog({
            title:'导入主机字段映射',
            width:720,
            content: '<div class="pt10">'+
                     '<form action="/host/importPrivateHostByExcel" id="upload_form" method="post" target="upload_proxy">'+
                     '<input type="hidden" name="filename" value="'+ data.filename +'">'+
                     '<div class="pt10">'+readTilte_html+'</div>'+
                     '</form>'+
                     '</div>',
            okValue:"确认",
            cancelValue:"关闭",
            skin:'dia-grid-batDel',
            ok:function (){
                var filterRadio = $('.user-filter');
                var flag = false;
                $.each(select2Arr,function(i,e) {
                    if(typeof(e) != 'undefined' && $(".user-filter").eq(i).prop('checked') == true){
                        var selectName = $(".user-filter").eq(i).prop('name') + '_select';
                        var selectVal = $('input[name='+selectName+']').select2("val");
                        if(selectVal == ''){
                            flag = true;
                        }
                    }
                });
                if(flag){
                    var d = dialog({
                        title:'确认',
                        width:350,
                        content: '<div class="c-dialogdiv2"><i class="c-dialogimg-prompt"></i>选择`映射已有字段时`必须要选择一个字段！</div>',
                        okValue:"确定",
                        ok:function(){}
                    });

                    d.showModal();
                    $(".import-error-list").mCustomScrollbar({
                        theme: "minimal-dark" //设置风格
                    });
                    return false;
                }else{
                    $("#upload_form").submit();
                }
                uploadDialog = dialog({
                    content: '<div class="c-dialogdiv2"><img class="c-dialogimg-loading" src="/static/img/loading_2_24x24.gif"></img>正在导入...</div>'
                });
                uploadDialog.showModal();
                setTimeout(function(){
                    //clearUpload($(e.target).attr('id'));
                },500);
            }
        });
        importPrivateHost.showModal();
        $(".select2_box").select2({ data: select2data });
        //框初始化后赋值
        $.each(titles,function(i,ie) {
            $.each(select2Arr,function(j,je) {
                if(typeof(je) != 'undefined' && ie.name == je.text){
                    $("div.select2_box").eq(i).show().siblings().hide().select2("val", je.id);
                    $(".user-filter").eq(i).prop('checked',true);
                    
                    var num="";
                    //选中值在数组中的位置
                    $.each(select2data,function(n,m) {
                        if(m.id==je.id){
                            num=n;
                        }
                    })
                    //删除该位置的节点
                    select2data.splice(num,1);
                }
            })
        })
        var currentVal="";
        var selectVal="";
        //下拉框 筛选时获取当前值
        $("input.select2_box").on("select2-open", function(e) {
            currentVal=$(this).select2("val");
        }).on("change", function(e) {
            selectVal=$(this).select2("val");
            var num="";
            //选中值在数组中的位置
            $.each(select2data,function(n,m) {
                if(m.id==selectVal){
                    num=n;
                }
            })
            //删除该位置的节点
            select2data.splice(num,1);
            $.each(select2Arr,function(n,m) {
                if(m.id==currentVal){
                    select2data.push(m);
                }
            })
        })  
        $('.import_readdialoga .user-defined').on('click',function(){
            var customerValue = $(this).closest('.import_readdialoga').find('.tableHeader').val();
            $(this).closest('.import_readdialoga').find('.user-defined-input').show().val(customerValue).siblings().hide();
        });
        $('.import_readdialoga .user-filter').on('click',function(){
            $(this).closest('.import_readdialoga').find('div.select2_box').show().siblings().hide();
        });
        //不导入按钮事件
        $('.import_readdialoga .user-noimport').on('click',function(){
            $(this).closest('.import_readdialoga').find('.user-noimport-input').show().siblings().hide();
            var currentVal=$(this).closest('.import_readdialoga').find('div.select2_box').select2("val");
            
            $.each(select2Arr,function(n,m) {
                if(m.id==currentVal){
                    select2data.push(m);
                }
            })
            $(this).closest('.import_readdialoga').find('div.select2_box').select2("val",'');
        });
    }else{
        var d = dialog({
            title:'确认',
            width:300,
            content: '<div class="c-dialogdiv2"><i class="c-dialogimg-prompt"></i>'+ data.errInfo +'</div>',
            okValue:"确定",
            ok:function(){}
        });

        d.showModal();
        $(".import-error-list").mCustomScrollbar({
            theme: "minimal-dark" //设置风格
        });
    }
}
