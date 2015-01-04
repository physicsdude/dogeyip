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

function createPost(address, tx, hexMessage, dictionary){
  var favamount = tx.time/100000000;
  var favaccount = address;
  var user = getUserAddress();
  var name = getUserName();
  var favoriteurl = 'favorite.html?user='+user+'&name='+name+'&favaccount='+favaccount+'&favamount='+favamount;
  var post = '<div id="'+tx.time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="https://useiconic.com/iconic/svg/comment-square.svg"/></td>'
             +   '<td>&nbsp;<font class="'+address+'">'+address+'</font></td>'
             +  '</tr>'
             +  '<tr><td></td><td>&nbsp;'+hash160ToText(hexMessage, dictionary)+'</td></tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<a href="'+favoriteurl+'">'
             +     '<img width=15 height=15 src="https://useiconic.com/iconic/svg/thumb.svg"/>'
             +    '</a><i><font color="gray"> &bull; '+timestamp(tx.time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
  var innerDiv = null;
  $('#posts').find('div').each(function(){
    var innerDivId = $(this).attr('id');
    if(innerDivId>tx.time && (innerDiv==null || innerDiv.attr('id')>innerDivId)){
      innerDiv=$(this);
    }
  });
  if(innerDiv==null){
    $("#posts").prepend(post);
  } else{
    innerDiv.after(post);
  }
}

function createFavorite(favamount, favaccount, address, tx, hexMessage, dictionary){
  var favname = favaccount;
  var user = getUserAddress();
  var name = getUserName();
  var url = "https://chain.so/api/v2/address/DOGE/"+favaccount;
  var favoriteurl = 'favorite.html?user='+favaccount+'&name='+favaccount+'&favaccount='+favaccount+'&favamount='+favamount;
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
            var post = '<div id="'+tx.time+'" style="padding: 10px">'
              + '<table>'
              +  '<tr>'
              +   '<td><img width=20 height=20 src="https://useiconic.com/iconic/svg/star.svg"/></td>'
              +   '<td>&nbsp;<a href="profile.html?user='+favaccount+'"><font class="'+favaccount+'">'+favname+'</font></a></td>'
              +  '</tr>'
              +  '<tr><td></td><td>&nbsp;'+hash160ToText(hexMessage, dictionary)+'</td></tr>'
              +  '<tr>'
              +   '<td></td>'
              +   '<td>&nbsp;'
              +    '<a href="'+favoriteurl+'">'
              +     '<img width=15 height=15 src="https://useiconic.com/iconic/svg/thumb.svg"/>'
              +    '</a><i><font color="gray"> &bull; '+timestamp(tx.time)+'</font></i>'
              +   '</td>'
              +  '</tr>'
              + "</table></div>";
            var innerDiv = null;
            $('#posts').find('div').each(function(){
              var innerDivId = $(this).attr('id');
              if(innerDivId>tx.time && (innerDiv==null || innerDiv.attr('id')>innerDivId)){
                innerDiv=$(this);
              }
            });
            if(innerDiv==null){
              $("#posts").prepend(post);
            } else{
              innerDiv.after(post);
            }
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

function createTip(tipaddress, address, tx, hexMessage, dictionary){
  var tipname = tipaccount;
  var user = getUserAddress();
  var name = getUserName();
  var url = "https://chain.so/api/v2/address/DOGE/"+tipaccount;
  var user = getUserAddress();
  var name = getUserName();
  var post = '<div id="'+tx.time+'" style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="https://dogechain.info/api/v1/address/qrcode/"'+tipaddress+'/></td>'
             +   '<td>&nbsp;<font class="'+tipaddress+'">'+tipaddress+'</font></td>'
             +  '</tr>'
             +  '<tr><td></td><td>&nbsp;'+address+" tipped "+tipaddress+'</td></tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<img width=15 height=15 src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"/>'
             +    '<i><font color="gray"> &bull; '+timestamp(tx.time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
  var innerDiv = null;
  $('#posts').find('div').each(function(){
    var innerDivId = $(this).attr('id');
    if(innerDivId>tx.time && (innerDiv==null || innerDiv.attr('id')>innerDivId)){
      innerDiv=$(this);
    }
  });
  if(innerDiv==null){
    $("#posts").prepend(post);
  } else{
    innerDiv.after(post);
  }
  
}

function isTip(output){
  return 15==output.value;
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

      for(var i=0; i<json.data.txs.length; i++){
        var tx = json.data.txs[i];
        if(tx.outgoing!=null){
          for(j=0; j<tx.outgoing.outputs.length; j++){
            var output = tx.outgoing.outputs[j];
            var hash160 = base58CheckTohash160(output.address);
            var hexMessage = hash160.substring(0,38);
            var hexToken = parseInt(hash160.substring(38,40), 16);
            if(isPost(hexToken)){
              createPost(userName, tx, hexMessage, dictionary);
            }
            if(isName(hexToken)){
              userName = hash160ToText(hexMessage, dictionary).trim();
            }
            if(isFavorite(tx, output)){
              createFavorite(output.value, output.address, userName, tx, hexMessage, dictionary);
            }
            if(isTip(output)){
              createTip(tipaddress, address, tx, hexMessage, dictionary);
            }
          }
        }
      };

      setUsername(userName);
      setLinks(userAddress,userName);
      $("."+userAddress).text(" "+userName);
    });
  });
}
