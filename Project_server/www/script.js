$(document).ready(function()
{
    $("#loginButton").click(function(event){
        event.preventDefault();
        ajaxPost();
    });
    $("#returnButton").click(function(event){
        event.preventDefault();
        window.location.href = '/test';
    });

    if ($("#loginEmail").length)
    {
    $.get("/api/username", function(data)
    {
        if (data.username)
        {
            $("#loginEmail").text(data.username);
            $("#loginEmail").css('color', 'blue');
        }
        else 
        {
            window.location.href = '/';
        }
    });
}

});

function ajaxPost()
{
    var loginData = 
    {
        email : $("#email").val(),
        password : $("#password").val()
    }
    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "/api/login",
        data : JSON.stringify(loginData),
        dataType : 'json',
        success : function(user)
        {
            if (user.valid == true)
            {
                window.location.href = '/account';
            }
            else
            {
                $('#loginButton').css('color', 'red');
            }
            
        },
        error : function(e){
            alert("Error!")
            console.log("ERROR: ", e);
        }



    });
}
