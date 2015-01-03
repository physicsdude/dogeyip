function base58CheckTohash160(base58Check){
  var hash160 = Bitcoin.Base58.decode(base58Check);
  var hexString = "";
  for(var i=0; i<hash160.length; i++){
    hexString+=hash160[i].toString(16);
  }
  return hexString.substring(2,42);
}

function createPost(tx, hexMessage, dictionary){
  var post = '<h3>'+timestamp(tx.time)+'</h3><p>'+hash160ToText(hexMessage, dictionary)+"</p>";
  $("#posts").append(post);
}

function isPost(hexLibrary){
  var start = parseInt("80",16);
  var end = parseInt("9F",16);
  return (hexLibrary>=start && hexLibrary<=end);
}

function constructPosts(json, dictionary){
  for(var i=0; i<json.data.txs.length; i++){
    var tx = json.data.txs[i];
    if(tx.outgoing!=null){
      for(j=0; j<tx.outgoing.outputs.length; j++){
        var output = tx.outgoing.outputs[j];
        var hash160 = base58CheckTohash160(output.address);
        var hexMessage = hash160.substring(0,38);
        var hexLibrary = parseInt(hash160.substring(38,40), 16);
        if(isPost(hexLibrary)){
          createPost(tx, hexMessage, dictionary)
        }
      }
    }
  };
}
