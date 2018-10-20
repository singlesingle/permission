$(document).ready(function() {

    $('.addedButtom').click(function(){
        adduser();
    });
    $(document).on("click", ".c-userlist-edit", evtEditRow);
    $(document).on("click", ".c-userlist-cancel", evtCancelEdit);
    $(document).on("click", ".c-userlist-delete", evtDelRow);
    $(document).on("click", ".c-userlist-save", evtSaveUser);
    $(document).on("click", ".c-userlist-reset", evtResetPassword);

    refreshGrid();
});

function enableRowEdit(row){
    var id = row.find('.id').text();
    var UserName = row.find('.UserName').text();
    var ChName = row.find('.ChName').text();
    var QQ = row.find('.QQ').text();
    var Tel = row.find('.Tel').text();
    var Email = row.find('.Email').text();
    var Role = row.find('.Role').attr('role');

    var disabledField = (curUserRole == 'admin') ? '' : 'disabled="disabled"';
    row.find('.UserName').html('<input required data-required-msg="请输入用户名" ' +
        'pattern="[A-Za-z0-9]{4,11}" validationMessage="用户名包含数字和字母，长度在4-10个字符" name="UserName" ' +
        'placeholder="请输入用户名" type="text" value="' + UserName + '" class="txt_username" ' + disabledField + '/>');
    row.find('.ChName').html('<input placeholder="请输入姓名" name="ChName" ' +
        'required data-required-msg="请输入姓名！" type="text" value="' + ChName + '" class="txt_chname" />');
    row.find('.QQ').html('<input required data-required-msg="请输入QQ" type="text" value="'+QQ+'" class="txt_qq"' +
        'pattern="[0-9]{4,13}" validationMessage="QQ号只能是数字组合" name="QQ" ' + '/>');
    row.find('.Tel').html('<input required data-required-msg="请输入手机号" placeholder="请输入手机号码" type="tel" name="Tel" ' +
        'pattern="\\d{11}" validationMessage="手机号码只能为11位数字" value="' + Tel + '" class="txt_tel"/>');
    row.find('.Email').html('<input required data-required-msg="请输入邮箱" placeholder="请输入常用邮箱" name="Email" ' +
        'validationMessage="邮箱格式不正确" pattern="^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$" type="email" value="' + Email + '" class="txt_email" />');
    var idHtml = row.find('.id').html();
    row.find('.id').html(idHtml + '<div style="display:none">' +
        '<span class="k-invalid-msg" data-for="UserName"></span>' +
        '<span class="k-invalid-msg" data-for="ChName"></span>' +
        '<span class="k-invalid-msg" data-for="Tel"></span>' +
        '<span class="k-invalid-msg" data-for="Email"></span>' +
        '</div>');
    row.find('.Role').html(
        '<select style="width:100%;" ' + disabledField + '>'+
           '<option value="admin">管理员</option>'+
           '<option value="user">用户</option>'+
       '</select>'
    );
    row.find('.Role select').val(Role);
    row.find('.Role select').select2({
        allowClear: true,
        minimumResultsForSearch: Infinity
    });
}

function evtEditRow(){
    var tr = $(this).closest('tr');
    $(this).hide();
    $(this).siblings().filter('a[name="deletes"]').hide();
    $(this).siblings().filter('a[name="saves"]').show();
    $(this).siblings().filter('a[name="cancels"]').show();

    enableRowEdit(tr);
}

function evtCancelEdit(){
    var tr = $(this).closest('tr');
    disableRowEdit(tr);
    $(this).hide();
    $(this).siblings().filter('a[name="edits"]').show();
    $(this).siblings().filter('a[name="deletes"]').show();
    $(this).siblings().filter('a[name="saves"]').hide();
}

function evtDelRow(){
    var thisObj = this;
    var tr = $(thisObj).closest('tr');
    var id = tr.find('.hid_id').val();
	var UserName = tr.find('.UserName').text();
    if('admin' == UserName) {
        showWindows('admin用户不能删除', 'error');
        return;
    }
    var gridBatDel = dialog({
        title: '确认',
        width: 250,
        content: '是否删除选中用户',
        okValue: '确定',
        cancelValue: '取消',
        ok: function (){
            $.post("/account/delUser", {'id': id}, function(result){
                var resultInfo = $.parseJSON(result);
                if(resultInfo.success == false) {
                    showWindows('删除失败！' + resultInfo.message, 'error');
                }else{
                    delete userList[id];
                    refreshGrid();
                    showWindows('删除成功！', 'success');
                }
            });
        },
        cancel: function () {
        }
    });
    gridBatDel.showModal();


}

function evtSaveUser(){
    var tr = $(this).closest('tr');
    var id = tr.find('.hid_id').val();
    var UserName = tr.find('.txt_username').val();
    var ChName = tr.find('.txt_chname').val();
    var QQ = tr.find('.txt_qq').val();
    var Tel = tr.find('.txt_tel').val();
    var Email = tr.find('.txt_email').val();
    var Role = tr.find('.Role select').select2('val');
    var form_validate = tr.kendoValidator().data("kendoValidator");
    if (form_validate.validate()) {
        var form_data = {};
        form_data['id'] = id;
        form_data['UserName'] = UserName;
        form_data['ChName'] = ChName;
        form_data['QQ'] = QQ;
        form_data['Tel'] = Tel;
        form_data['Email'] = Email;
        form_data['Role'] = Role;
        saveUserAjax(form_data);
        disableRowEdit(tr);
        $(this).hide();
        $(this).siblings().filter('a[name="cancels"]').hide();
        $(this).siblings().filter('a[name="edits"]').show();
        $(this).siblings().filter('a[name="deletes"]').show();
        $(this).siblings().filter('a[name="resets"]').show();

    } else {
        //表单验证未通过
        var errors = form_validate.errors();
        showWindows(errors.join('<br/>'), 'error');
        return false;
    }
}

function disableRowEdit(row){
    var grid = $('#grid_userManager').data('kendoGrid');
    var data = grid.dataItem(row.closest('tr'));
    var UserName = $(data.UserName).text();
    var ChName = $(data.ChName).text();
    var QQ = $(data.QQ).text();
    var Tel = $(data.Tel).text();
    var Email = $(data.Email).text();
    var Role = $(data.Role).text();
    row.find('.UserName').html(UserName);
    row.find('.ChName').html(ChName);
    row.find('.QQ').html(QQ);
    row.find('.Tel').html(Tel);
    row.find('.Email').html(Email);
    row.find('.Role').html(Role);
}

function refreshGrid(){
    if(!userList){
        userList = {};
    }
    var tbl_html = '';
    var grid = $('#grid_userManager').data('kendoGrid');
    if(grid){
        grid.destroy();
        $('#grid_userManager').remove();
    }

    $("#ctn_userlist").html($("#tpl_grid").html());

    for(userId in userList){
        var userInfo = userList[userId];
        if(userInfo['Role'] == 'admin'){
            userInfo['RoleName'] = '管理员';
        }else{
            userInfo['RoleName'] = '用户';
        }
        tbl_html += kendo.template($("#tpl_user_tr").html())(userInfo);
    }

    $("#tbl_userlist_body").html(tbl_html);

    $("#grid_userManager").kendoGrid({
        pageable: {
            pageSize: 10,
            buttonCount: 3,
            refresh: false
        },
        scrollable: false,
        dataBound: function(e) {
            $("#grid_userManager").css("opacity","1")
        }
    });



}

function evtResetPassword() {
    var id = $(this).closest('tr').find('.hid_id').val();
    var userName = userList[id].UserName;
    var form_content = kendo.template($("#tpl_reset_password").html())({});
    var newdialoga = dialog({
        title:'密码重置',
        width:500,
        content:form_content,
        okValue:"重置",
        cancelValue:"取消",
        skin:'dia-grid-batDel',
        ok:function (){
            var password_text=$('.password_text').val();
            var password_text2=$('.password_text2').val();
            if(password_text==''||password_text2==''){
                $('.userManager_tips').html('*输入的密码不能为空');
                return false;
            }else if(password_text!=password_text2){
                $('.userManager_tips').html('*密码不一致，请重新输入');
                return false;
            }else if(password_text==password_text2){
                $('.userManager_tips').html('');
            }

            var postData = {
                'UserName': userName,
                'Password': password_text
            };
            $.post("/account/changePassword", postData, function(result){
                var resultInfo = $.parseJSON(result);
                if(resultInfo.success == false) {
                    showWindows('重置密码失败！' + resultInfo.message, 'error');
                }else{
                    showWindows('重置密码成功！', 'success');
                }
            });
        },
        cancel: function () {
        }
    });

    //弹出框初始化
    newdialoga.showModal();
}

function adduser() {
    var form_content = kendo.template($("#tpl_new_user").html())({});
    var newdialoga = dialog({
        title:'新增用户',
        width:500,
        content: form_content,
        okValue:"新增",
        cancelValue:"取消",
        skin:'dia-grid-batDel',
        ok:function (){
            var form_validate = $("#frm_new_user").kendoValidator().data("kendoValidator");
            if (form_validate.validate()) {
                //表单验证通过
                var form_data = $("#frm_new_user").serialize();
                saveUserAjax(form_data);
            } else {
                //表单验证未通过
                return false;
            }
        },
        cancel: function () {
        }
    });


    //弹出框初始化
    newdialoga.showModal();
}

function saveUserAjax(user_info){
    $.post("/account/saveUser", user_info, function(result){
        var resultInfo = $.parseJSON(result);
        if(resultInfo.success == false) {
            showWindows('保存用户失败！' + resultInfo.message, 'error');
            return false;
        }else{
            showWindows('保存用户成功！', 'success');
            userList[resultInfo.user.id] = resultInfo.user;
            refreshGrid();
            return true;
        }
    });
}