var dictionaryCache = {};

function lookupDictionary(dictionaryToken){
  if(dictionaryCache[dictionaryToken] != null){
    return dictionaryCache[dictionaryToken];
  } else{
    var dictionaryAddress = "english_dictionary_decode.json";
    var ajax = $.getJSON(dictionaryAddress);
    dictionaryCache[dictionaryToken] = ajax;
    return ajax;
  }
}

function getDictionary(dictionaryToken){
  var deferred = new $.Deferred();

  lookupDictionary(dictionaryToken).done(function(json){
    deferred.resolve(json);
  });

  return deferred.promise();
}
