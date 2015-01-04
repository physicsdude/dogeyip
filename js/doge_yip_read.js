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

function updateName(address, hexMessage, dictionary){
  var username = hash160ToText(hexMessage, dictionary).trim();
  setUsername(username);
  setLinks(address,username);
  $("."+address).text(" "+username);
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
      for(var i=0; i<json.data.txs.length; i++){
        var tx = json.data.txs[i];
        if(tx.outgoing!=null){
          for(j=0; j<tx.outgoing.outputs.length; j++){
            var output = tx.outgoing.outputs[j];
            var hash160 = base58CheckTohash160(output.address);
            var hexMessage = hash160.substring(0,38);
            var hexToken = parseInt(hash160.substring(38,40), 16);
            if(output.address=="DJiCoYsdreqCR9oG1FVDavWMyA1b6QbPRU"){
              console.log("hash160: "+hash160);
              console.log("hexMessage: "+hexMessage);
              console.log("hexToken: "+hexToken);
            }
            if(isPost(hexToken)){
              createPost(tx, hexMessage, dictionary)
            }
            if(isName(hexToken)){
              updateName(userAddress, hexMessage, dictionary)
            }
          }
        }
      };
    });
  });
}
