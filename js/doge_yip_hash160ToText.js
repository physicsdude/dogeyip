function hash160ToText(hex, dictionary) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2){
    var value = hex.substr(i, 2);
    if(hex.substr(i,1)=="8" || hex.substr(i,1)=="9"){
      str+=" "+dictionary[hex.substr(i,4)];
      i+=2;
    } else{
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
  }
  return str;
};
