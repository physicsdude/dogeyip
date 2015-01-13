var dictionaryCache = {};
var dictionaryChoice = "english_dictionary_decode.json";

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

  lookupDictionary(dictionaryChoice).done(function(json){
    deferred.resolve(json);
  });

  return deferred.promise();
}

function getEncodeDictionary(dictionaryToken){
  var deferred = new $.Deferred();

  lookupDictionary(dictionaryChoice).done(function(json){
    deferred.resolve(json);
  });

  return deferred.promise();
}
