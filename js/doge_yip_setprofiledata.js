function getUserAddress() {
  var parameters = window.location.search.substring(1).split('&');
  for (var i = 0; i < parameters.length; i++)  {
   var parameter = parameters[i].split('=');
    if (parameter[0] == 'user') {
        return parameter[1];
    }
  }
}

function setProfileData(){
  var username = getUserAddress();
  $("#username").text(username);
  $("#barklink").attr("href","post.html?user="+username);
  $("#profilelink").attr("href","profile.html?user="+username);
  $("#languagelink").attr("href","language.html?user="+username);
  $("#indexlink").attr("href","index.html?user="+username);
  $("#setnamelink").attr("href","setname.html?user="+username);

  var about = "";
  $("#about").append(about);

  var img = "<img width=125px height=125px src='https://dogechain.info/api/v1/address/qrcode/"+username+"'></img>";
  $("#qrcode").append(img);
}
