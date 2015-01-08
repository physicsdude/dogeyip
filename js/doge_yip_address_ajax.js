var baseUrl = "https://chain.so/api/v2/address/DOGE/";
var addressCache = {};

function getAddressJson(address){
  if(addressCache[address] != null){
    return addressCache[address];
  } else{
    var ajax = $.getJSON(baseUrl+address);
    addressCache[address] = ajax;
    return ajax;
  }
}
