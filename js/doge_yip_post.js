function textToHex(str) {
  var hex = '';
  for(var i=0;i<str.length;i++) {
    hex += ''+str.charCodeAt(i).toString(16);
  }
  return hex;
};

function hash160ToBase58Check(hash160){
  var address = new Bitcoin.Address(Crypto.util.hexToBytes(hash160))
  address.version = 0x1E //testnet would be 0x6F
  return address.toString();
}

function messageToBase58Check(message, dictionary, dictionaryHex){
  var words = message.split(' ');
  for(var i=0; i<words.length; i++){
    var word = words[i];
    if(dictionary.hasOwnProperty(word)){
      word=dictionary[word];
    } else if(word.length>3 && dictionary.hasOwnProperty(word.substring(0, word.length-1))){
      word=dictionary[word.substring(0, word.length-1)]+textToHex(word.substring(word.length-1));
    } else if(word.length>4 && dictionary.hasOwnProperty(word.substring(0, word.length-2))){
      word=dictionary[word.substring(0, word.length-2)]+textToHex(word.substring(word.length-2));
    } else if(word.length>5 && dictionary.hasOwnProperty(word.substring(0, word.length-3))){
      word=dictionary[word.substring(0, word.length-3)]+textToHex(word.substring(word.length-3));
    } else if(i!=0){
      word=textToHex(" "+word);
    } else{
      word=textToHex(word);
    }
    words[i]=word;
  }
  message = words.join("");
  if(message.length>38){
    return null;
  } else{
    while(message.length<38){
      message+="20";
    }
    /*Add the library to use to decode message*/
    message+=dictionaryHex
    return hash160ToBase58Check(message);
  }
}
