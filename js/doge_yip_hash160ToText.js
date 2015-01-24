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
    var keywords = [];
    var links = [];
    var images = [];
    for(var i=0; i<words.length; i++){
      var word = words[i];
      if(isMention(word)){
        mentions.push(word.substring(1));
      } else if(isKeyword(word)){
        keywords.push(word.substring(1))
      } else if(isImage(word)){
        images.push(word);
      } else if(isUrl(word)){
        links.push(word);
      }
    }

    /*DO SRING REPLACEMENTS FOR MENTIONS*/
    if(mentions.length>0){
      for(var key in mentions){
        var mention = mentions[key];
        var onclick = "onclick='showLink(\"search\");$(\"#dogeyipsearchresults\").html(\"\");$(\"#dogeyipsearch\").val(\""+mention+"\");listResults(\""+mention+"\", \"dogeyipsearchresults\");'"
        //var onclick = "onclick='showLink(\"search\");'"
        message = message.replace('@'+mention, "<a href='javascript: void(0)' "+onclick+">@"+mention+"</a>");
      }
    }

    /*DO SRING REPLACEMENTS FOR HASHTAGS*/
    if(keywords.length>0){
      for(var key in keywords){
        var keyword = keywords[key];
        var onclick = "onclick='showLink(\"search\");$(\"#dogeyipsearchresults\").html(\"\");$(\"#dogeyipsearch\").val(\"#"+keyword+"\");listKeywordPosts(\""+keyword+"\", \"dogeyipsearchresults\");'"
        message = message.replace('#'+keyword, "<a href='javascript: void(0)' "+onclick+">#"+keyword+"</a>");
      }
    }

    /*DO STRING REPLACEMENTS FOR IMAGES*/
    if(images.length>0){
      for(var key in images){
        var image = images[key];
        message = message.replace(image, "<a style='display: block;' href='"+image+"'><img style='box-shadow: 0 3px 2px rgba(0, 0, 0, 0.3);' width=25% src='"+image+"'/></a>")
      }
    }

    /*DO STRING REPLACEMENTS FOR HYPERLINKS*/
    if(links.length>0){
      for(var key in links){
        var link = links[key];
        var linktext = link.replace('http://','').replace('www.','');
        message = message.replace(link, "<a href='"+link+"'>"+linktext+"</a>")
      }
    }

    deferred.resolve(message);
  });

  return deferred.promise();
};

function isMention(word){
  return word.substring(0, 1)=="@";
}

function isKeyword(word){
  return word.substring(0, 1)=="#";
}

function isUrl(word){
  return (word.substring(0,7)=='http://' || word.substring(0,4)=='www.')
}

function isImage(word){
  var imageSuffixes = [".png",".gif",".jpg",".jpeg",".bmp"]
  if(isUrl(word)){
    for(var i=0; i<imageSuffixes.length; i++){
      var suffix = imageSuffixes[i];
      if(word.indexOf(suffix, word.length - suffix.length) !== -1){
        return true;
      }
    }
  }
  return false;
}

function hash160ToUsername(hex) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2){
    var value = hex.substr(i, 2);
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};
