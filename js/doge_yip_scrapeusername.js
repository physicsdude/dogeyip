usernameCache = {};

function getUsername(userAddress){
  var deferred = new $.Deferred();

  if(usernameCache[userAddress]==null){
    getAddressJson(userAddress).done(function(json){
      var hasName = false;
      for(var i=0; i<json.data.txs.length; i++){
        var tx = json.data.txs[i];
        if(tx.outgoing!=null){
          for(j=0; j<tx.outgoing.outputs.length; j++){
            var output = tx.outgoing.outputs[j];
            var hash160 = base58CheckTohash160(output.address);
            var hexUsername = hash160.substring(0,38);
            var hexToken = parseInt(hash160.substring(38,40), 16);

            if(isName(hexToken)){
              hasName=true;
              $.when(hash160ToText(hexUsername, hexToken)).done(function(username){
                usernameCache[userAddress]=username;
                deferred.resolve(username);
              });
            }
          }
        }
      }
      if(!hasName){
        usernameCache[userAddress]=userAddress;
        deferred.resolve(userAddress);
      }
    });
  } else{
    deferred.resolve(usernameCache[userAddress]);
  }
  
  return deferred.promise();
}
