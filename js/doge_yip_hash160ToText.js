function isPartialMessage(hex){
  var hexToken = parseInt(hex.substring(0,2),16);
  var startHexLibraryTokenRange = parseInt("00",16);
  var endHexLibraryTokenRange = parseInt("1F",16);
  return (hexToken>=startHexLibraryTokenRange && hexToken<=endHexLibraryTokenRange);
}

function hash160ToText(hex, dictionaryToken, connectingPosts) {
  var deferred = new $.Deferred();

  getDictionary(dictionaryToken).done(function(dictionary){
    while(isPartialMessage(hex)){
      connectingPost = connectingPosts[hex.substring(0,4)];
      if(connectingPost!=null){
        hex = connectingPost+hex.substring(4);
      } else{
        hex = hex.substring(4);
      }
    }

    var message = '';
    for (var i = 0; i < hex.length; i += 2){
      var value = hex.substr(i, 2);
      if(hex.substr(i,1)=="8" || hex.substr(i,1)=="9"){
        message+=" "+dictionary[hex.substr(i,4)];
        i+=2;
      } else{
        message += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
    }

    var words = message.split(' ');
    var mentions = [];      
    for(var i=0; i<words.length; i++){
      var word = words[i];
      if(word.substring(0, 1)=="@"){
        mentions.push(word.substring(1));
      }
    }
    if(mentions.length>0){
      for(var key in mentions){
        var mention = mentions[key];
        var onclick = "onclick='showLink(\"search\");$(\"#dogeyipsearchresults\").html(\"\");$(\"#dogeyipsearch\").val(\""+mention+"\");listResults(\""+mention+"\", \"dogeyipsearchresults\");'"
        //var onclick = "onclick='showLink(\"search\");'"
        message = message.replace('@'+mention, "<a href='javascript: void(0)' "+onclick+">@"+mention+"</a>");
      }
    }
    var keywords = [];      
    for(var i=0; i<words.length; i++){
      var word = words[i];
      if(word.substring(0, 1)=="#"){
        keywords.push(word.substring(1));
      }
    }
    if(keywords.length>0){
      for(var key in keywords){
        var keyword = keywords[key];
        var onclick = "onclick='showLink(\"search\");$(\"#dogeyipsearchresults\").html(\"\");$(\"#dogeyipsearch\").val(\"#"+keyword+"\");listKeywordPosts(\""+keyword+"\", \"dogeyipsearchresults\");'"
        message = message.replace('#'+keyword, "<a href='javascript: void(0)' "+onclick+">#"+keyword+"</a>");
      }
    }
    deferred.resolve(message);
  });

  return deferred.promise();
};

function hash160ToUsername(hex) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2){
    var value = hex.substr(i, 2);
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};
