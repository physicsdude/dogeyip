function getUserAddress() {
  var address = null;
  var parameters = window.location.search.substring(1).split('&');
  for (var i = 0; i < parameters.length; i++)  {
   var parameter = parameters[i].split('=');
    if (parameter[0] == 'user') {
        address = parameter[1];
    }
  }
  if(address!=null){
    return address;
  } else{
    return "DPRrGMJ3Vtf6atodtZ9HsUVqmZjWkjGj8Q";
  }
}

function getUserName() {
  var name = null;
  var address = null;
  var parameters = window.location.search.substring(1).split('&');
  for (var i = 0; i < parameters.length; i++)  {
   var parameter = parameters[i].split('=');
    if (parameter[0] == 'name') {
        name = parameter[1];
    }
    if (parameter[0] == 'name') {
        address = parameter[1];
    }
  }
  if(name!=null){
    return name;
  } else if(address!=null){
    return address;
  } else{
    return "Doge_Yip";
  }
}

function setProfileData(){
  var address = getUserAddress();
  var name = getUserName();
  $("#username").text(name);
  $(".barklink").attr("href","post.html?name="+name+"&user="+address);
  $(".profilelink").attr("href","profile.html?name="+name+"&user="+address);
  $(".languagelink").attr("href","language.html?name="+name+"&user="+address);
  $(".indexlink").attr("href","index.html?name="+name+"&user="+address);
  $(".setnamelink").attr("href","setname.html?name="+name+"&user="+address);

  var about = "";
  $("#about").append(about);

  var img = "<img width=125px height=125px src='https://dogechain.info/api/v1/address/qrcode/"+address+"'></img>";
  $("#qrcode").append(img);
}
