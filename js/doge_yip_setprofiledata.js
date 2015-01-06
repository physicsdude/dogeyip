function getUserAddress() {
  var parameters = window.location.search.substring(1).split('&');
  for (var i = 0; i < parameters.length; i++)  {
   var parameter = parameters[i].split('=');
    if (parameter[0] == 'user') {
        return parameter[1];
    }
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
    if (parameter[0] == 'user') {
        address = parameter[1];
    }
  }
  if(name!=null){
    return name;
  } else{
    return address;
  }
}

function getFavoriteAmount() {
  var parameters = window.location.search.substring(1).split('&');
  for (var i = 0; i < parameters.length; i++)  {
   var parameter = parameters[i].split('=');
    if (parameter[0] == 'favamount') {
        return parameter[1];
    }
  }
}

function getFavoriteAccount() {
  var parameters = window.location.search.substring(1).split('&');
  for (var i = 0; i < parameters.length; i++)  {
   var parameter = parameters[i].split('=');
    if (parameter[0] == 'favaccount') {
        return parameter[1];
    }
  }
}

function setLinks(address, name){
  $(".barklink").attr("href","post.html?name="+name+"&user="+address);
  $(".profilelink").attr("href","profile.html?name="+name+"&user="+address);
  $(".languagelink").attr("href","language.html?name="+name+"&user="+address);
  $(".indexlink").attr("href","index.html?name="+name+"&user="+address);
  $(".setnamelink").attr("href","setname.html?name="+name+"&user="+address);
  $(".searchlink").attr("href","search.html?name="+name+"&user="+address);
}

function setUsername(name){
  $("#username").text(name);
  $(".username").text(name);
}

function setAddress(address){
  $(".address").text(address);
}

function setAbout(about){
  $("#about").append(about);
}

function setQRCode(address){
  var qrcode = new QRCode("profileQR", {
    text: address,
    width: 100,
    height: 100,
    colorDark : "#000000",
    colorLight : "#54C571",
    correctLevel : QRCode.CorrectLevel.H
  });
  var img = "https://dogechain.info/api/v1/address/qrcode/"+address;
  $(".qrlink").attr("href",img);
}

function setProfileData(){
  var address = getUserAddress();
  var name = getUserName();
  var about = "";
  setUsername(name);
  setAddress(address);
  setLinks(address, name);
  setAbout(about);
}
