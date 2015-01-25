function textToHex(str) {
  var hex = '';
  for(var i=0;i<str.length;i++) {
    hex += ''+str.charCodeAt(i).toString(16);
  }
  return hex;
};

function hash160ToBase58Check(hash160){
  var hash160Array = [];
  for(var i=0; i<40; i+=2){
    var hex = hash160.substring(i, i+2);
    hash160Array.push(parseInt(hex,16));
  }
  var chunk2 = window.dogeyip.buffer(hash160Array);
  var address = new bitcoin.Address(chunk2, 30);
  return address.toString();
};

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function messageToBase58Check(message, dictionary, dictionaryHex){
  var words = message.split(' ');
  for(var i=0; i<words.length; i++){
    var word = words[i];
    if(dictionary==null){
      word=textToHex(word);
    } else if(dictionary.hasOwnProperty(word)){
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

  addresses = [];
  while(message.length>38){
    var randHexA=("0"+getRandomInt(0,31).toString(16)).slice(-2);

    /*
    * Do not use hex values from 90 to 9F as those values denote special events.
    * For instance, don't want the last value to be 9F because then part of our post is going to appear in our name.
    */
    
    var randValueB = getRandomInt(0,223);
    if(randValueB>143){
      randValueB+=16;
    }
    var randHexB=("0"+randValueB.toString(16)).slice(-2);

    var address = hash160ToBase58Check(message.substring(0,36)+randHexA+randHexB);
    addresses.push(address);
    message=randHexA+randHexB+message.substring(36);
  }
  while(message.length<38){
    message+="20";
  }
  var address = hash160ToBase58Check(message+dictionaryHex);
  addresses.push(address);
  return addresses;
}
