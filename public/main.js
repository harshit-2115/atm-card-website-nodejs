$(document).ready(function() {
    var x= getCookie("Email");
    $("#setImage").attr("src",x+".jpg");
    $("a.nav-link").click(function() {
      $("a").removeClass('active');
      $(this).addClass('active');
      var a = $(this).attr('id');
      if (a!='transacDetails.html') {
      if (a == 'logout') {alert("Hello");}
        else{
     $.ajax({url: a , success: function(result){
      // alert(result);
        $("main").html(result);
    }});   
   }
}
   });
    function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
   
});
