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
  $("#bigqrcodeaddress").val(address);
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
  showLink("favorite");
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
  });
}

/* POPULATE HTML CACHE */
var cachedHTML = {};
function getHtml(url){
  var deferred = new $.Deferred();
  if(cachedHTML[url]!=null){
    return cachedHTML[url];
  } else{
    $.ajax({
      url: url,
      dataType: 'html'
    }).done(function(html) {
      cachedHTML[url]=html;
      deferred.resolve(html);
    });
  }
  return deferred.promise();
}

/* POPULATE TIP NOTIFICATION */
function createTipNotification(toName, toAddress, fromAddress, time){
  var when = $.when(getUser(fromAddress),getHtml("html/posts/tip_notification.html"));

  when.done(function(from, html){
    var notification = html.replace("&TONAME;",toName)
                           .replace("&TOADDRESS;",toAddress)
                           .replace("&FROMNAME;",from.username)
                           .replace("&FROMADDRESS;",from.address)
                           .replace("&TIMESTAMP;",timestamp(time))
                           .replace("&TIME;",time);
    insertHtml("notifications", notification, time);
  });
}

/* POPULATE FAVORITE NOTIFICATION */
function createFavoriteNotification(to, fromAddress, fromAmount){
  var when = $.when(getUser(fromAddress), getHtml("html/posts/favorite_notification.html"));
  when.done(function(from,html){
    for(var i=0; i<to.posts.length; i++){
      if(to.posts[i].time==fromAmount*100000000){
        var toHexMessage = to.posts[i].hexMessage;
        var toHexLibrary = to.posts[i].hexLibrary;
        var toConnectingPosts = to.connectingPosts;
        var toTime = to.posts[i].time;
        hash160ToText(toHexMessage, toHexLibrary, toConnectingPosts).done(function(toMessage){
          var notification = html.replace("&TONAME;", to.username)
                                 .replace("&TOADDRESS;", to.address)
                                 .replace("&FROMNAME;", from.username)
                                 .replace("&FROMADDRESS;", from.address)
                                 .replace("&FAVACCOUNT;", to.address)
                                 .replace("&FAVAMOUNT;", fromAmount)
                                 .replace("&TIMESTAMP;", timestamp(toTime))
                                 .replace("&TIME;", toTime)
                                 .replace("&MESSAGE;", toMessage);
          insertHtml("notifications", notification, toTime);
        });
      }
    }
  });
}

/* POPULATE YIP */
function createPost(divId, username, useraddress, time, hexMessage, hexToken, connectingPosts){
  var favaccount = useraddress;
  var favamount = time/100000000;
  var when = $.when(hash160ToText(hexMessage, hexToken, connectingPosts), getHtml("html/posts/yip.html"))
  when.done(function(message, html){
    var post = html.replace("&TIME;", time)
                   .replace("&USERADDRESS;", useraddress)
                   .replace("&USERNAME;", username)
                   .replace("&FAVACCOUNT;", favaccount)
                   .replace("&FAVAMOUNT;", favamount)
                   .replace("&TIMESTAMP;", timestamp(time))
                   .replace("&MESSAGE;", message);
    insertHtml(divId, post, time);
  });
}

/* POPULATE FAVORITE */
function createFavorite(divId, favamount, favaccount, username, useraddress){
  var when = $.when(getUser(favaccount), getHtml("html/posts/favorite.html"));
  when.done(function(fav, html){
    for(var i=0; i<fav.posts.length; i++){
      if(fav.posts[i].time==favamount*100000000){
        var favHexMessage = fav.posts[i].hexMessage;
        var favHexLibrary = fav.posts[i].hexLibrary;
        var favConnectingPosts = fav.connectingPosts;
        var favTime = fav.posts[i].time;
        hash160ToText(favHexMessage, favHexLibrary, favConnectingPosts).done(function(message){
          var favorite = html.replace("&TIME;", favTime)
                             .replace("&USERADDRESS;", useraddress)
                             .replace("&USERNAME;", username)
                             .replace("&FAVACCOUNT;", favaccount)
                             .replace("&FAVNAME;", fav.username)
                             .replace("&MESSAGE;", message)
                             .replace("&FAVAMOUNT;", favamount)
                             .replace("&TIMESTAMP;", timestamp(favTime));
          insertHtml(divId, favorite, favTime);
        });
      }
    }
  });
}

function createTip(divId, username, useraddress, tipaddress, time){
  var when = $.when(getUser(tipaddress), getHtml("html/posts/tip.html"));
  when.done(function(tip, html){
    var tipHtml = html.replace("&TIME;", time)
                      .replace("&USERADDRESS;", useraddress)
                      .replace("&USERNAME;", username)
                      .replace("&TIPADDRESS;", tipaddress)
                      .replace("&TIPNAME;", tip.username)
                      .replace("&TIMESTAMP;", timestamp(time))
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
