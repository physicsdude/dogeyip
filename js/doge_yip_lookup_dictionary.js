var dictionaryCache = {};

function lookupDictionary(address){
  if(dictionaryCache[address] != null){
    return dictionaryCache[address];
  } else{
    var ajax = $.getJSON(address);
    dictionaryCache[address] = ajax;
    return ajax;
  }
}

function getDictionary(dictionaryToken){
  var deferred = new $.Deferred();

  lookupDictionary("english_dictionary_decode.json").done(function(json){
    deferred.resolve(json);
  });

  return deferred.promise();
}

function getEncodeDictionary(dictionaryToken){
  var deferred = new $.Deferred();

  lookupDictionary("english_dictionary_encode.json").done(function(json){
    deferred.resolve(json);
  });

  return deferred.promise();
}
