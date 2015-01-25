function listResults(searchTerm, divId){
  if(searchTerm.length>2){
    var dictionary = null;
    var dictionaryHex = "9F"
    var address = messageToBase58Check(searchTerm, dictionary, dictionaryHex);
    getSearch(address).done(function(results){
      for(var i=0; i<results.length; i++){
        scrapeProfileSearchData(results[i], divId);
      }
    });
  }
}
