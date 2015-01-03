function createPost(tx, dictionary){
  var url = "https://chain.so/api/v2/get_tx_outputs/DOGE/"+tx.txid
  $.getJSON(url, function( json ) {
    var post = '<h3>'+timestamp(tx.time)+'</h3><p>';
    for(var i=0; i<json.data.outputs.length; i++){
      var output = json.data.outputs[i];
      if(output.value==.2093){
        post += hash160ToText(output.script, dictionary);
      };
    };
    post+="</p>"
    $("#posts").append(post);
  });
}

function constructPosts(json, dictionary){
  for(var i=0; i<json.data.txs.length; i++){
    var tx = json.data.txs[i];
    if(tx.outgoing!=null){
      var is_post = false;
      for(j=0; j<tx.outgoing.outputs.length; j++){
        var output = tx.outgoing.outputs[j];
        if(output.value==.2093){
          is_post=true;
        }
      }
      if(is_post){
        createPost(tx, dictionary);
      }
    }
  };
}
