var baseUrl = "http://api-dogeyip.rhcloud.com/?address=";
//var baseUrl = "https://chain.so/api/v2/address/DOGE/";
var addressCache = {};
var searchCache = {};

setInterval(function(){addressCache={}},90000);
setInterval(function(){searchCache={}},90000);

function getUser(address){
  var deferred = new $.Deferred();

  if(addressCache[address] != null){
    return addressCache[address];
  } else{
    addressCache[address] = deferred;
    var ajax = $.getJSON(baseUrl+address);
    $.when(ajax).done(function(json){
      if(baseUrl=="http://api-dogeyip.rhcloud.com/?address="){
        var user = constructUserDataFromDogeYip(json, address);
        deferred.resolve(user);
      } else if(baseUrl=="https://chain.so/api/v2/address/DOGE/"){
        var user = constructUserDataFromChainSo(json, address);
        deferred.resolve(user);
      }
    });
  }

  return deferred.promise();
}

function getSearch(address){
  var deferred = new $.Deferred();

  if(searchCache[address] != null){
    return searchCache[address];
  } else{
    searchCache[address] = deferred;
    var ajax = $.getJSON(baseUrl+address);
    $.when(ajax).done(function(json){
      if(baseUrl=="http://api-dogeyip.rhcloud.com/?address="){
        var searchData = constructSearchDataFromDogeYip(json);
        deferred.resolve(searchData);
      } else if(baseUrl=="https://chain.so/api/v2/address/DOGE/"){
        var searchData = constructSearchDataFromChainSo(json);
        deferred.resolve(searchData);
      }
    });
  }

  return deferred.promise();
}

function constructSearchDataFromDogeYip(json){
  var searchResults = [];
  for(var i=0; i<json.length; i++){
    var tx = json[i];
    if(tx.type=='input'){
      accountAddress = tx.address;
      if(!inArray(searchResults, accountAddress)){
        searchResults.push(accountAddress);
      }
    }
  }
  return searchResults;
}

function constructSearchDataFromChainSo(json){
  var searchResults = [];
  for(var i=0; i<json.data.txs.length; i++){
    var tx = json.data.txs[i];
    if(tx.incoming!=null){
      for(j=0; j<tx.incoming.inputs.length; j++){
        accountAddress = tx.incoming.inputs[j].address;
        if(!inArray(searchResults, accountAddress)){
          searchResults.push(accountAddress);
        }
      }
    }
  }
  return searchResults;
}

function constructUserDataFromDogeYip(json, address){
  var user = {}
  user.timestamp = new Date();
  user.username = address;
  user.address = address;
  user.posts = [];
  user.connectingPosts = [];
  user.output = {};
  user.output.favorites = {};
  user.output.tips = {};
  user.input = {};
  user.input.favorites = [];
  user.input.tips = [];
  user.input.messages = [];

  for(var i=0; i<json.length; i++){
    var tx = json[i];
    if(tx.type=='output'){
      var hash160 = base58CheckTohash160(tx.address);
      var hexMessage = hash160.substring(0,38);
      var hexTokenA = parseInt(hash160.substring(36,38), 16);
      var hexTokenB = parseInt(hash160.substring(38,40), 16);
      if(isPost(hexTokenA, hexTokenB)){
        var post = {}
        post.hexMessage = hexMessage;
        post.hexLibrary = hexTokenB;
        post.time = tx.time;
        user.posts.push(post);
      }
      if(isFavorite(tx.amount, tx.time)){
        var favorite = {};
        favorite.address = tx.address;
        favorite.amount = tx.amount;
        favorite.time = tx.time;
        user.output.favorites[favorite.address+"_"+favorite.timestamp]=favorite;
      }
      if(isTip(tx.amount)){
        var tip = {};
        tip.address = tx.address;
        tip.amount = tx.amount;
        tip.time = tx.time;
        user.output.tips[tip.address] = tip;
      }
      if(isName(hexTokenB) && user.username==user.address){
        user.username = hash160ToUsername(hexMessage).trim();
      }
      if(isConnectingPost(hexTokenA)){
        user.connectingPosts[hash160.substring(36,40)]=hexMessage.substring(0,36);
      }
    } else if(tx.type=='input'){
      if(isFavoriteNotification(tx.amount, tx.time)){
        var favorite = {};
        favorite.address = tx.address;
        favorite.amount = tx.amount;
        favorite.time = tx.time;
        user.input.favorites[favorite.address+"_"+favorite.timestamp]=favorite;
      }
      if(isTipNotification(tx.amount)){
        var tip = {};
        tip.address = tx.address;
        tip.amount = tx.amount;
        tip.time = tx.time;
        user.input.tips[tip.address] = tip;
      }
      if(isMessageNotification(tx.amount)){
        var message = {};
        message.address = tx.address;
        message.amount = tx.amount;
        message.time = tx.time;
        user.input.messages[message.address] = message;
      }
    }
  }
  return user;
}

function constructUserDataFromChainSo(json, address){
  var user = {}
  user.timestamp = new Date();
  user.username = address;
  user.address = address;
  user.posts = [];
  user.connectingPosts = [];
  user.output = {};
  user.output.favorites = {};
  user.output.tips = {};
  user.input = {};
  user.input.favorites = [];
  user.input.tips = [];
  user.input.messages = [];

  var txs = json.data.txs;
  for(var i=0; i<txs.length; i++){
    var tx = txs[i];
    if(tx.outgoing!=null){
      for(j=0; j<tx.outgoing.outputs.length; j++){
        var output = tx.outgoing.outputs[j];
        var hash160 = base58CheckTohash160(output.address);
        var hexMessage = hash160.substring(0,38);
        var hexTokenA = parseInt(hash160.substring(36,38), 16);
        var hexTokenB = parseInt(hash160.substring(38,40), 16);
        if(isPost(hexTokenA, hexTokenB)){
          var post = {}
          post.hexMessage = hexMessage;
          post.hexLibrary = hexTokenB;
          post.time = tx.time;
          user.posts.push(post);
        } 
        if(isFavorite(output.value, tx.time)){
          var favorite = {};
          favorite.address = output.address;
          favorite.amount = output.value;
          favorite.time = tx.time;
          user.output.favorites[favorite.address+"_"+favorite.timestamp]=favorite;
        }
        if(isTip(output.value)){
          var tip = {};
          tip.address = output.address;
          tip.amount = output.value;
          tip.time = tx.time;
          user.output.tips[tip.address] = tip;
        } 
        if(isName(hexTokenB) && user.username==user.address){
          user.username = hash160ToUsername(hexMessage).trim();
        } 
        if(isConnectingPost(hexTokenA)){
          user.connectingPosts[hash160.substring(36,40)]=hexMessage.substring(0,36);
        }
      }
    }
    if(tx.incoming!=null && isFavoriteNotification(tx.incoming.value, tx.time)){
      var favorite = {};
      favorite.address = tx.incoming.inputs[0].address;
      favorite.amount = tx.incoming.value;
      favorite.time = tx.time;
      user.input.favorites[favorite.address+"_"+favorite.timestamp]=favorite;
    }
    if(tx.incoming!=null && isTipNotification(tx.incoming.value)){
      var tip = {};
      tip.address = tx.incoming.inputs[0].address;
      tip.amount = tx.incoming.value;
      tip.time = tx.time;
      user.input.tips[tip.address] = tip;
    }
    if(tx.incoming!=null && isMessageNotification(tx.incoming.value)){
      var message = {};
      message.address = tx.incoming.inputs[0].address;
      message.amount = tx.incoming.value;
      message.time = tx.time;
      user.input.messages[message.address] = message;
    }
  }
  return user;
}

function isTip(amount){
  return 15==amount;
}

function isFavoriteNotification(amount, time){
  var time = time/100000000;
  return (amount>time-1 && amount<time+1);
}

function isTipNotification(amount){
  return amount==15;
}

function isMessageNotification(amount){
  return amount==1;
}

function isFavorite(amount, time){
  var time = time/100000000;
  return (amount>time-1 && amount<time+1) && amount!=15;
}

function isConnectingPost(hexToken){
  var startHexLibraryTokenRange = parseInt("00",16);
  var endHexLibraryTokenRange = parseInt("1F",16);
  return (hexToken>=startHexLibraryTokenRange && hexToken<=endHexLibraryTokenRange);
}

function isPost(hexTokenA, hexTokenB){
  var startHexLibraryTokenRange = parseInt("80",16);
  var endHexLibraryTokenRange = parseInt("9D",16);
  var hasLibraryHex = (hexTokenB>=startHexLibraryTokenRange && hexTokenB<=endHexLibraryTokenRange);
  var hasConnectingPostHex = isConnectingPost(hexTokenA)
  return (hasLibraryHex && !hasConnectingPostHex);
}

function isMessageToName(hexToken){
  var hexNameToken = parseInt("9E",16);
  return (hexToken==hexNameToken);
}

function isName(hexToken){
  var hexNameToken = parseInt("9F",16);
  return (hexToken==hexNameToken);
}
