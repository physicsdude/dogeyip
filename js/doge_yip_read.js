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
  var favorite = 'Send '+tx.time/100000000+' DOGE to '+address+' to favorite post.';
  var post = '<div style="padding: 10px">'
             + '<table>'
             +  '<tr>'
             +   '<td><img width=20 height=20 src="https://useiconic.com/iconic/svg/comment-square.svg"/></td>'
             +   '<td>&nbsp;<font class="'+address+'">'+address+'</font></td>'
             +  '</tr>'
             +  '<tr><td></td><td>&nbsp;'+hash160ToText(hexMessage, dictionary)+'</td></tr>'
             +  '<tr>'
             +   '<td></td>'
             +   '<td>&nbsp;'
             +    '<a class="favoritelink" href="javascript: void(0)" onclick="alert(\''+favorite+'\')">'
             +     '<img width=15 height=15 src="https://useiconic.com/iconic/svg/thumb.svg"/> 0<i>'
             +    '</a><font color="gray"> - '+timestamp(tx.time)+'</font></i>'
             +   '</td>'
             +  '</tr>'
             + "</table></div>";
  $("#posts").append(post);
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
              createPost(userName, tx, hexMessage, dictionary)
            }
            if(isName(hexToken)){
              userName = hash160ToText(hexMessage, dictionary).trim();
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
