function listResults(searchTerm){
  if(searchTerm.length>2){
    var dictionary = null;
    var dictionaryHex = "9F"
    var base58Check = messageToBase58Check(searchTerm, dictionary, dictionaryHex);
    getAddressJson(base58Check).done(function(json){
      var searchResults = [];
      for(var i=0; i<json.data.txs.length; i++){
        var tx = json.data.txs[i];
        if(tx.incoming!=null){
          for(j=0; j<tx.incoming.inputs.length; j++){
            accountAddress = tx.incoming.inputs[j].address;
            if(!inArray(searchResults, accountAddress)){
              listAccount(accountAddress);
              searchResults.push(accountAddress);
            }
          }
        }
      };
    });
  }
}
