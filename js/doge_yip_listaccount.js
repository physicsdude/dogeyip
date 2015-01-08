function listResults(searchTerm, divId){
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
              listAccount(accountAddress, divId);
              searchResults.push(accountAddress);
            }
          }
        }
      };
    });
  }
}

function listAccount(accountAddress, divId){
  $.when(getUsername(accountAddress)).done(function(accountName){
    var profile = "profile.html?user="+accountAddress;
    var result = "<div class='container'>"
               + '<a onclick="showProfile(\''+accountAddress+'\')" href="javascript: void(0)">'
               +   "<img style='vertical-align:middle;' width=35px height=35px src='img/open-iconic/person.svg'></img>"
               +   "<span><font style='font-size: 175%; vertical-align:middle;'>&nbsp;"+accountName+"</font></span>"
               + "</a>"
               + "</div><br/>";
    $("#"+divId).append(result);
  });
}
