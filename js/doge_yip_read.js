function base58CheckTohash160(base58Check){
  var hash160 = Bitcoin.Base58.decode(base58Check);
  var hexString = "";
  for(var i=0; i<hash160.length; i++){
    var hex = "0"+hash160[i].toString(16);
    hex = hex.substring(hex.length-2,hex.length);
    hexString+=hex;
  }
  return hexString.substring(2,42);
}

function insertHtml(divId, html, time){
  innerDiv = null;
  $('#'+divId).find('div').each(function(){
    var innerDivId = $(this).attr('id');
    if(innerDivId>time && (innerDiv==null || innerDiv.attr('id')>innerDivId)){
      innerDiv=$(this);
    }
  });
  if(innerDiv==null){
    $("#"+divId).prepend(html);
  } else if(innerDiv){
    innerDiv.after(html);
  }
}


var profileqrcode;
function setQRCode(address){
  if(profileqrcode==null){
    profileqrcode = new QRCode("profileQR", {
      text: address,
      width: 125,
      height: 125,
      colorDark : "#000000",
      colorLight : "#54C571",
      correctLevel : QRCode.CorrectLevel.H
    });
  } else{
    profileqrcode.clear();
    profileqrcode.makeCode(address);
  }
}

var bigqrcode;
function showQrCode(address){
  if(bigqrcode==null){
      bigqrcode = new QRCode("bigqrcodeimg", {
      text: address,
      width: 150,
      height: 150,
      colorDark : "#000000",
      colorLight : "#FBF0D9",
      correctLevel : QRCode.CorrectLevel.H
    });
  } else{
    bigqrcode.clear();
    bigqrcode.makeCode(address);
  }
  showLink("bigqrcode");
}

function showProfile(address){
  getUser(address).done(function(user){
    $("#notifications").html("");
    $("#posts").html("");
    $("#news").html("");
    var profileBanner = "<h2>"+user.username+"</h2>"
                      + '<p>To tip send 15 DOGE to <a onclick="showQrCode(\''+user.address+'\')" href="javascript: void(0)">'+user.username+'</a></p>';
    $(".profilebanner").html(profileBanner);
    setQRCode(user.address);
    showLink("profile");
    scrapeTransactionData(user.address);
  });
}

var favoriteqrcode;
function showFavorite(address, amount){
  if(favoriteqrcode==null){
      favoriteqrcode = new QRCode("favoriteQRPostCode", {
      text: address,
      width: 150,
      height: 150,
      colorDark : "#000000",
      colorLight : "#FBF0D9",
      correctLevel : QRCode.CorrectLevel.H
    });
  } else{
    favoriteqrcode.clear();
    favoriteqrcode.makeCode(address);
  }
  getUser(address).done(function(user){
    var favoritebanner = '<h2>Favorite</h2>'
                       + '<p>'
                       +   'To favorite this bark send <b>'+amount+' DOGE</b> to <a onclick="showProfile(\''+address+'\')" href="javascript: void(0)">'+user.username+'</a>\'s address.'
                       + '</p>';
    $("#favoriteBase58Check").val(address);
    $(".favoritebanner").html(favoritebanner);
    showLink("favorite");
  });
}

function constructPostHtml(username, useraddress, favaccount, favamount, time, message){
  return '<div id="'+time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="img/open-iconic/comment-square.svg"/></td>'
             +   '<td>&nbsp;'
             +    '<a onclick="showProfile(\''+useraddress+'\')" href="javascript: void(0)">'+username+'</a> posted: '
             +   '</td>'
             +  '</tr>'
             +  '<tr><td></td><td>&nbsp;'+message+'</td></tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<a onclick="showFavorite(\''+favaccount+'\',\''+favamount+'\')" href="javascript: void(0)">'
             +     '<img width=15 height=15 src="img/open-iconic/thumb-up.svg"/>'
             +    '</a><i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
}

function constructFavoriteHtml(username, useraddress, favaccount, favamount, favname, time, message){
  return '<div id="'+time+'" style="padding: 10px">'
              + '<table>'
              +  '<tr>'
              +   '<td><img width=20 height=20 src="img/open-iconic/star.svg"/></td>'
              +   '<td>&nbsp;'
              +    '<a onclick="showProfile(\''+useraddress+'\')" href="javascript: void(0)">'+username+'</a> favorited '
              +    '<a onclick="showProfile(\''+favaccount+'\')" href="javascript: void(0)">'+favname+'</a> post'
              +   '</td>'
              +  '</tr>'
              +  '<tr><td></td><td>&nbsp;'+message+'</td></tr>'
              +  '<tr>'
              +   '<td></td>'
              +   '<td>&nbsp;'
              +    '<a onclick="showFavorite(\''+favaccount+'\',\''+favamount+'\')" href="javascript: void(0)">'
              +     '<img width=15 height=15 src="img/open-iconic/thumb-up.svg"/>'
              +    '</a><i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
              +   '</td>'
              +  '</tr>'
              + "</table></div>";
}

function constructFavoriteNotificationHtml(toName, toAddress, fromName, fromAddress, favaccount, favamount, time, message){
  return '<div id="'+time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="img/open-iconic/star.svg"/></td>'
             +   '<td>&nbsp;'
             +    '<a onclick="showProfile(\''+fromAddress+'\')" href="javascript: void(0)">'+fromName+'</a> favorited '
             +    '<a onclick="showProfile(\''+toAddress+'\')" href="javascript: void(0)">'+toName+"'s Bark."
             +   '</td>'
             +  '</tr>'
             +  '<tr><td></td><td>&nbsp;'+message+'</td></tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<a onclick="showFavorite(\''+favaccount+'\',\''+favamount+'\')" href="javascript: void(0)">'
             +     '<img width=15 height=15 src="img/open-iconic/thumb-up.svg"/>'
             +    '</a><i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
}

function constructTipHtml(username, useraddress, tipname, tipaddress, time){
  return '<div id="'+time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="img/open-iconic/badge.svg"/></td>'
             +   '<td>&nbsp;'
             +    '<a onclick="showProfile(\''+useraddress+'\')" href="javascript: void(0)">'+username+'</a> tipped '
             +    '<a onclick="showProfile(\''+tipaddress+'\')" href="javascript: void(0)">'+tipname+'</a>'
             +   '</td>'
             +  '</tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<img width=15 height=15 src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"/>'
             +    '<i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
}

function constructTipNotificationHtml(toName, toAddress, fromName, fromAddress, time){
  return '<div id="'+time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="img/open-iconic/badge.svg"/></td>'
             +   '<td>&nbsp;'
             +    '<a onclick="showProfile(\''+fromAddress+'\')" href="javascript: void(0)">'+fromName+'</a> tipped '
             +    '<a onclick="showProfile(\''+toAddress+'\')" href="javascript: void(0)">'+toName+'</a>'
             +   '</td>'
             +  '</tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<img width=15 height=15 src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"/>'
             +    '<i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
}

function createTipNotification(toName, toAddress, fromAddress, time){
  var when = getUser(fromAddress).done(function(from){
    var notification = constructTipNotificationHtml(toName, toAddress, from.username, from.address, time);
    insertHtml("notifications", notification, time);
  });
}

function createFavoriteNotification(to, fromAddress, fromAmount){
  getUser(fromAddress).done(function(from){
    for(var i=0; i<to.posts.length; i++){
      if(to.posts[i].time==fromAmount*100000000){
        var toHexMessage = to.posts[i].hexMessage;
        var toHexLibrary = to.posts[i].hexLibrary;
        var toConnectingPosts = to.connectingPosts;
        var toTime = to.posts[i].time;
        hash160ToText(toHexMessage, toHexLibrary, toConnectingPosts).done(function(toMessage){
          var notification = constructFavoriteNotificationHtml(to.username, to.address, from.username, from.address, to.address, fromAmount, toTime, toMessage);
          insertHtml("notifications", notification, toTime);
        });
      }
    }
  });
}

function createPost(divId, username, useraddress, time, hexMessage, hexToken, connectingPosts){
  var favaccount = useraddress;
  var favamount = time/100000000;
  hash160ToText(hexMessage, hexToken, connectingPosts).done(function(message){
    var post = constructPostHtml(username, useraddress, favaccount, favamount, time, message); 
    insertHtml(divId, post, time);
  });
}

function createFavorite(divId, favamount, favaccount, username, useraddress){
  getUser(favaccount).done(function(fav){
    for(var i=0; i<fav.posts.length; i++){
      if(fav.posts[i].time==favamount*100000000){
        var favHexMessage = fav.posts[i].hexMessage;
        var favHexLibrary = fav.posts[i].hexLibrary;
        var favConnectingPosts = fav.connectingPosts;
        var favTime = fav.posts[i].time;
        hash160ToText(favHexMessage, favHexLibrary, favConnectingPosts).done(function(message){
          var favorite = constructFavoriteHtml(username, useraddress, favaccount, favamount, fav.username, favTime, message);
          insertHtml(divId, favorite, favTime);
        });
      }
    }
  });
}

function createTip(divId, username, useraddress, tipaddress, time){
  var when = getUser(tipaddress).done(function(tip){
    var tipHtml = constructTipHtml(username, useraddress, tip.username, tipaddress, time);
    insertHtml(divId, tipHtml, time);
  });
}

function scrapeRecentActivity(address, divId){
  getUser(address).done(function(user){
    for(var i=0; i<user.posts.length; i++){
      var post = user.posts[i];
      createPost(divId, user.username, user.address, post.time, post.hexMessage, post.hexLibrary, user.connectingPosts);
    }
    for (var key in user.output.favorites) {
      favoriteaddress = user.output.favorites[key].address
      favoriteamount = user.output.favorites[key].amount
      favoritetime = user.output.favorites[key].time
      createFavorite(divId, favoriteamount, favoriteaddress, user.username, user.address);
    }
    for (var key in user.output.tips) {
      tipaddress = user.output.tips[key].address
      tipamount = user.output.tips[key].amount
      tiptime = user.output.tips[key].time
      createTip(divId, user.username, user.address, tipaddress, tiptime);
    }
  });
}

function scrapeTransactionData(address){
  getUser(address).done(function(user){
    for(var i=0; i<user.posts.length; i++){
      var post = user.posts[i];
      createPost("posts", user.username, user.address, post.time, post.hexMessage, post.hexLibrary, user.connectingPosts);
    }
    for (var key in user.output.favorites) {
      favoriteaddress = user.output.favorites[key].address
      favoriteamount = user.output.favorites[key].amount
      favoritetime = user.output.favorites[key].time
      createFavorite("posts", favoriteamount, favoriteaddress, user.username, user.address);
    }
    for (var key in user.output.tips) {
      tipaddress = user.output.tips[key].address
      tipamount = user.output.tips[key].amount
      tiptime = user.output.tips[key].time
      createTip("posts", user.username, user.address, tipaddress, tiptime);
      scrapeRecentActivity(tipaddress, "news")
    }
    for (var key in user.input.favorites) {
      favoriteaddress = user.input.favorites[key].address
      favoriteamount = user.input.favorites[key].amount
      favoritetime = user.input.favorites[key].time
      createFavoriteNotification(user, favoriteaddress, favoriteamount);
    }
    for (var key in user.input.tips) {
      tipaddress = user.input.tips[key].address
      tipamount = user.input.tips[key].amount
      tiptime = user.input.tips[key].time
      createTipNotification(user.username, user.address, tipaddress, tiptime);
    }
  });
}
