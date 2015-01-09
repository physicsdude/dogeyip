var baseUrl = "https://chain.so/api/v2/address/DOGE/";
var addressCache = {};

function getAddressJson(address){
  var deferred = new $.Deferred();

  if(addressCache[address] != null){
    return addressCache[address];
  } else{
    addressCache[address] = deferred;
    var ajax = $.getJSON(baseUrl+address);
    $.when(ajax).done(function(json){
      deferred.resolve(json);
    });
  }

  return deferred.promise();
}
