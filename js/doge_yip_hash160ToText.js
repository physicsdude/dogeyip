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

    var str = '';
    for (var i = 0; i < hex.length; i += 2){
      var value = hex.substr(i, 2);
      if(hex.substr(i,1)=="8" || hex.substr(i,1)=="9"){
        str+=" "+dictionary[hex.substr(i,4)];
        i+=2;
      } else{
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
    }
    deferred.resolve(str);
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
