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

function constructPostHtml(address, favoriteurl, time, message){
  return '<div id="'+time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="https://useiconic.com/iconic/svg/comment-square.svg"/></td>'
             +   '<td>&nbsp;<font class="'+address+'">'+address+'</font></td>'
             +  '</tr>'
             +  '<tr><td></td><td>&nbsp;'+message+'</td></tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<a href="'+favoriteurl+'">'
             +     '<img width=15 height=15 src="https://useiconic.com/iconic/svg/thumb.svg"/>'
             +    '</a><i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
}

function constructFavoriteHtml(address, favoriteurl, favaccount, favname, time, message){
  return '<div id="'+time+'" style="padding: 10px">'
              + '<table>'
              +  '<tr>'
              +   '<td><img width=20 height=20 src="https://useiconic.com/iconic/svg/star.svg"/></td>'
              +   '<td>&nbsp;<a href="profile.html?user='+favaccount+'"><font class="'+favaccount+'">'+favname+'</font></a></td>'
              +  '</tr>'
              +  '<tr><td></td><td>&nbsp;'+message+'</td></tr>'
              +  '<tr>'
              +   '<td></td>'
              +   '<td>&nbsp;'
              +    '<a href="'+favoriteurl+'">'
              +     '<img width=15 height=15 src="https://useiconic.com/iconic/svg/thumb.svg"/>'
              +    '</a><i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
              +   '</td>'
              +  '</tr>'
              + "</table></div>";
}

function constructTipHtml(address, tipaddress, time){
  return '<div id="'+time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="https://useiconic.com/iconic/svg/bitcoin-address.svg"/></td>'
             +   '<td>&nbsp;<font class="'+address+'">'+address+'</font></td>'
             +  '</tr>'
             +  '<tr><td></td><td>&nbsp;tipped <a href="profile.html?user='+tipaddress+'"><font class="'+tipaddress+'">'+tipaddress+'</font></a></td></tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<img width=15 height=15 src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"/>'
             +    '<i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
}

function constructFavoriteNotificationHtml(toAddress, fromAddress, favoriteurl, time, message){
  return '<div id="'+time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="https://useiconic.com/iconic/svg/star.svg"/></td>'
             +   '<td>&nbsp;<a href="profile.html?user='+fromAddress+'"><font class="'+fromAddress+'">'+fromAddress+'</font></a> favorited <font class="'+toAddress+'">'+toAddress+"</font>'s Bark.</td>"
             +  '</tr>'
             +  '<tr><td></td><td>&nbsp;'+message+'</td></tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<a href="'+favoriteurl+'">'
             +     '<img width=15 height=15 src="https://useiconic.com/iconic/svg/thumb.svg"/>'
             +    '</a><i><font color="gray"> &bull; '+timestamp(time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
}

function constructTipNotificationHtml(toAddress, fromAddress, time){
  return '<div id="'+time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="https://useiconic.com/iconic/svg/bitcoin-address.svg"/></td>'
             +   '<td>&nbsp;<a href="profile.html?user='+fromAddress+'"><font class="'+fromAddress+'">'+fromAddress+'</font></a> tipped <font class="'+toAddress+'">'+toAddress+"</font></td>"
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

function createTipNotification(toAddress, fromAddress, tx, dictionary){
  var time = tx.time;
  var notification = constructTipNotificationHtml(toAddress, fromAddress, time);
  insertHtml("notifications", notification, time);
  insertHtml("recentactivity", notification, time);

  var url = "https://chain.so/api/v2/address/DOGE/"+fromAddress;
  $.getJSON(url, function(json) {
    var favname = fromAddress;
    for(var i=0; i<json.data.txs.length; i++){
      var tx = json.data.txs[i];
      if(tx.outgoing!=null){
        for(j=0; j<tx.outgoing.outputs.length; j++){
          var output = tx.outgoing.outputs[j];
          var hash160 = base58CheckTohash160(output.address);
          var hexMessage = hash160.substring(0,38);
          var hexToken = parseInt(hash160.substring(38,40), 16);
          if(isName(hexToken)){
            favname = hash160ToText(hexMessage, dictionary).trim();
          }
        }
      }
    };
    $("."+fromAddress).text(" "+favname);
  });
}

function createFavoriteNotification(toAddress, fromAddress, txs, notificationAmount, dictionary){
  createdFavoriteNotification = false;
  for(var i=0; i<txs.length; i++){
    var tx = txs[i];
    if(tx.outgoing!=null){
      for(j=0; j<tx.outgoing.outputs.length; j++){
        var output = tx.outgoing.outputs[j];
        if(tx.time/100000000==notificationAmount){
          var hash160 = base58CheckTohash160(output.address);
          var hexMessage = hash160.substring(0,38);
          var hexToken = parseInt(hash160.substring(38,40), 16);
          if(isPost(hexToken) && !createdFavoriteNotification){
            var user = getUserAddress();
            var favoriteurl = 'favorite.html?user='+user+'&favaccount='+toAddress+'&favamount='+notificationAmount;
            var time = tx.time;
            var message = hash160ToText(hexMessage, dictionary);
            var notification = constructFavoriteNotificationHtml(toAddress, fromAddress, favoriteurl, time, message)
            insertHtml("notifications", notification, time);
            insertHtml("recentactivity", notification, time);
            createdFavoriteNotification=true;

            var url = "https://chain.so/api/v2/address/DOGE/"+fromAddress;
            $.getJSON(url, function(json) {
              var favname = fromAddress;
              for(var i=0; i<json.data.txs.length; i++){
                var tx = json.data.txs[i];
                if(tx.outgoing!=null){
                  for(j=0; j<tx.outgoing.outputs.length; j++){
                    var output = tx.outgoing.outputs[j];
                    var hash160 = base58CheckTohash160(output.address);
                    var hexMessage = hash160.substring(0,38);
                    var hexToken = parseInt(hash160.substring(38,40), 16);
                    if(isName(hexToken)){
                      favname = hash160ToText(hexMessage, dictionary).trim();
                    }
                  }
                }
              };
              $("."+fromAddress).text(" "+favname);
            });
          }
        }
      }
    }
  }
}

function createPost(address, tx, hexMessage, dictionary){
  var favamount = tx.time/100000000;
  var favaccount = address;
  var user = getUserAddress();
  var favoriteurl = 'favorite.html?user='+user+'&favaccount='+favaccount+'&favamount='+favamount;
  var time = tx.time;
  var message = hash160ToText(hexMessage, dictionary);
  var post = constructPostHtml(address, favoriteurl, time, message); 
  insertHtml("posts", post, time);
  insertHtml("recentactivity", post, time);
}

function createFavorite(divId, favamount, favaccount, address, tx, hexMessage, dictionary){
  var favname = favaccount;
  var user = getUserAddress();
  var name = getUserName();
  var url = "https://chain.so/api/v2/address/DOGE/"+favaccount;
  var favoriteurl = 'favorite.html?user='+favaccount+'&favaccount='+favaccount+'&favamount='+favamount;
  $.getJSON(url, function(json) {
    for(var i=0; i<json.data.txs.length; i++){
      var tx = json.data.txs[i];
      if(tx.outgoing!=null){
        for(j=0; j<tx.outgoing.outputs.length; j++){
          var output = tx.outgoing.outputs[j];
          var hash160 = base58CheckTohash160(output.address);
          var hexMessage = hash160.substring(0,38);
          var hexToken = parseInt(hash160.substring(38,40), 16);
          if(isPost(hexToken) && favamount==(tx.time/100000000)){
            var time = tx.time;
            var message = hash160ToText(hexMessage, dictionary);
            var post = constructFavoriteHtml(address, favoriteurl, favaccount, favname, time, message);
            insertHtml(divId, post, time);
          };
          if(isName(hexToken)){
            favname = hash160ToText(hexMessage, dictionary).trim();
          }
        }
      }
    };
    $("."+favaccount).text(" "+favname);
  });
}

function createTip(tipaddress, address, tx){
  var time = tx.time;
  var post = constructTipHtml(address, tipaddress, time);
  insertHtml("posts", post, time);
}

function createNews(userAddress, tipaddress, dictionary){
  var url = "https://chain.so/api/v2/address/DOGE/"+tipaddress;
  $.getJSON(url, function(json) {
    var tipname = tipaddress;
    var sentFavoriteAmounts = [];
    var sentTipAddresses = [];

    for(var i=0; i<json.data.txs.length; i++){
      var tx = json.data.txs[i];
      if(tx.outgoing!=null){
        for(j=0; j<tx.outgoing.outputs.length; j++){
          var output = tx.outgoing.outputs[j];
          var hash160 = base58CheckTohash160(output.address);
          var hexMessage = hash160.substring(0,38);
          var hexToken = parseInt(hash160.substring(38,40), 16);
          if(isPost(hexToken)){
            var time = tx.time;
            var favamount = time/100000000;
            var favaccount = tipaddress;
            var favoriteurl = 'favorite.html?user='+favaccount+'&favaccount='+favaccount+'&favamount='+favamount;
            var message = hash160ToText(hexMessage, dictionary);
            var post = constructPostHtml(tipaddress, favoriteurl, time, message); 
            insertHtml("news", post, time);
          }
          if(isTip(output) && userAddress!=output.address && !inArray(sentTipAddresses, output.address)){
            var time = tx.time;
            var post = constructTipHtml(tipaddress, output.address, time);
            insertHtml("news", post, time);
            sentTipAddresses.push(output.address)
          }
          if(isFavorite(tx, output) && userAddress!=output.address && !inArray(sentFavoriteAmounts, output.address+"_"+output.value)){
            createFavorite("news", output.value, output.address, tipaddress, tx, hexMessage, dictionary);
            sentFavoriteAmounts.push(output.address+"_"+output.value)
          }
          if(isName(hexToken)){
            tipname = hash160ToText(hexMessage, dictionary).trim();
          }
        }
      }
    };
    $("."+tipaddress).text(" "+tipname);
  });
}

function isTip(output){
  return 15==output.value;
}

function isFavoriteNotification(tx){
  var amount = tx.incoming.value
  var time = tx.time/100000000;
  return (tx.incoming.inputs!=null && amount>time-1 && amount<time+1);
}

function isTipNotification(tx){
  var amount = tx.incoming.value
  var time = tx.time/100000000;
  return (tx.incoming.inputs!=null && amount==15);
}

function isFavorite(tx, output){
  var amount = output.value
  var time = tx.time/100000000;
  return (amount>time-1 && amount<time+1);
}

function isPost(hexToken){
  var startHexLibraryTokenRange = parseInt("80",16);
  var endHexLibraryTokenRange = parseInt("9E",16);
  return (hexToken>=startHexLibraryTokenRange && hexToken<=endHexLibraryTokenRange);
}

function isName(hexToken){
  var hexNameToken = parseInt("9F",16);
  return (hexToken==hexNameToken);
}

function scrapeTransactionData(userAddress){
  var url = "https://chain.so/api/v2/address/DOGE/"+userAddress;
  /* Going to need to address the hardcoded dictionary issue soon */
  $.getJSON("english_dictionary_decode.json", function(dictionary) {
    $.getJSON(url, function(json) {
      var userName = userAddress;
      var followedAddresses = [userAddress];
      var sentFavoriteAmounts = [];
      var sentTipAddresses = [];
      var receivedFavoriteAmounts = [];
      var receivedTipAddresses = [];

      for(var i=0; i<json.data.txs.length; i++){
        var tx = json.data.txs[i];
        if(tx.outgoing!=null){
          for(j=0; j<tx.outgoing.outputs.length; j++){
            var output = tx.outgoing.outputs[j];
            var hash160 = base58CheckTohash160(output.address);
            var hexMessage = hash160.substring(0,38);
            var hexToken = parseInt(hash160.substring(38,40), 16);
            if(isPost(hexToken)){
              createPost(userAddress, tx, hexMessage, dictionary);
            }
            if(isName(hexToken)){
              userName = hash160ToText(hexMessage, dictionary).trim();
            }
            if(isFavorite(tx, output) && !inArray(sentFavoriteAmounts, output.value)){
              createFavorite("posts", output.value, output.address, userAddress, tx, hexMessage, dictionary);
              sentFavoriteAmounts.push(output.value);
              if(!inArray(followedAddresses, output.address)){
                createNews(userAddress, output.address, dictionary);
                followedAddresses.push(output.address);
              }
            }
            if(isTip(output)){
              if(!inArray(sentTipAddresses, output.address)){
                createTip(output.address, userAddress, tx);
                sentTipAddresses.push(output.address);
              }
              if(!inArray(followedAddresses, output.address)){
                createNews(userAddress, output.address, dictionary);
                followedAddresses.push(output.address);
              }
            }
          }
        }
        if(tx.incoming!=null && isFavoriteNotification(tx)){
          var amount = tx.incoming.value;
          var input = tx.incoming.inputs[0];
          if(!inArray(receivedFavoriteAmounts, input.address+"_"+amount)){
            createFavoriteNotification(userAddress, input.address, json.data.txs, amount, dictionary);
            receivedFavoriteAmounts.push(input.address+"_"+amount);
          }
        }
        if(tx.incoming!=null && isTipNotification(tx)){
          var input = tx.incoming.inputs[0];
          if(!inArray(receivedTipAddresses, input.address)){
            createTipNotification(userAddress, input.address, tx, dictionary);
            receivedTipAddresses.push(input.address);
          }
        }
      };
      setUsername(userName);
      setLinks(userAddress,userName);
      $("."+userAddress).text(" "+userName);
    });
  });
}
