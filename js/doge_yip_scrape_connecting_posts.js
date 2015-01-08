function getConnectingPosts(userAddress){
  var deferred = new $.Deferred();

  var connectingPosts = {};
  getAddressJson(userAddress).done(function(json){
    for(var i=0; i<json.data.txs.length; i++){
      var tx = json.data.txs[i];
      if(tx.outgoing!=null){
        for(j=0; j<tx.outgoing.outputs.length; j++){
          var output = tx.outgoing.outputs[j];
          var hash160 = base58CheckTohash160(output.address);
          var hexMessage = hash160.substring(0,36);
          var hexTokenA = hash160.substring(36,38);
          var hexTokenB = hash160.substring(38,40);
          if(isConnectingPost(parseInt(hexTokenA),16)){
            connectingPosts[hexTokenA+hexTokenB]=hexMessage;
          }
        }
      }
    }
    deferred.resolve(connectingPosts);
  });

  return deferred.promise();
}
