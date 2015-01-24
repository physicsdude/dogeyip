function listResults(searchTerm, divId){
  if(searchTerm.length>2){
    var dictionary = null;
    var dictionaryHex = "9F"
    var address = messageToBase58Check(searchTerm, dictionary, dictionaryHex);
    getSearch(address).done(function(results){
      for(var i=0; i<results.length; i++){
        listAccount(results[i], divId);
      }
    });
  }
}

function listAccount(address, divId){
  $.when(getUser(address)).done(function(user){
    if(user.username!=user.address){
      var profile = "profile.html?user="+user.address;
      var result = "<div class='container'>"
               + '<a onclick="showProfilePreview(\''+user.address+'\')" href="javascript: void(0)">'
               +   "<img style='vertical-align:middle;' width=35px height=35px src='img/open-iconic/person.svg'></img>"
               +   "<span><font style='font-size: 175%; vertical-align:middle;'>&nbsp;"+user.username+"</font></span>"
               + "</a>"
               + "</div><br/>";
      $("#"+divId).append(result);
    }
  });
}
