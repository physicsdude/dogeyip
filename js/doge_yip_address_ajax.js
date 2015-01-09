var baseUrl = "https://chain.so/api/v2/address/DOGE/";
var addressCache = {};
var searchCache = {};

function getUser(address){
  var deferred = new $.Deferred();

  if(addressCache[address] != null){
    return addressCache[address];
  } else{
    addressCache[address] = deferred;
    var ajax = $.getJSON(baseUrl+address);
    $.when(ajax).done(function(json){
      var user = constructUserData(json, address);
      deferred.resolve(user);
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
      var searchData = constructSearchData(json);
      deferred.resolve(searchData);
    });
  }

  return deferred.promise();
}

function constructSearchData(json){
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


function constructUserData(json, address){
  var user = {}
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
        if(isPost(hexTokenB)){
          var post = {}
          post.hexMessage = hexMessage;
          post.hexLibrary = hexTokenB;
          post.time = tx.time;
          user.posts.push(post);
        } 
        if(isFavorite(tx, output)){
          var favorite = {};
          favorite.address = output.address;
          favorite.amount = output.value;
          favorite.time = tx.time;
          user.output.favorites[favorite.address+"_"+favorite.timestamp]=favorite;
        } 
        if(isTip(output)){
          var tip = {};
          tip.address = output.address;
          tip.amount = output.value;
          tip.time = tx.time;
          user.output.tips[tip.address] = tip;
        } 
        if(isName(hexTokenB)){
          user.username = hash160ToUsername(hexMessage).trim();
        } 
        if(isConnectingPost(hexTokenA)){
          user.connectingPosts[hash160.substring(36,40)]=hexMessage.substring(0,36);
        }
      }
    }
    if(tx.incoming!=null && isFavoriteNotification(tx)){
      var favorite = {};
      favorite.address = tx.incoming.inputs[0].address;
      favorite.amount = tx.incoming.value;
      favorite.time = tx.time;
      user.input.favorites[favorite.address+"_"+favorite.timestamp]=favorite;
    }
    if(tx.incoming!=null && isTipNotification(tx)){
      var tip = {};
      tip.address = tx.incoming.inputs[0].address;
      tip.amount = tx.incoming.value;
      tip.time = tx.time;
      user.input.tips[tip.address] = tip;
    }
  }
  return user;
}

function isTip(output){
  return 15==output.value;
}

function isFavoriteNotification(tx){
  var amount = tx.incoming.value
  var time = tx.time/100000000;
  return (tx.incoming.inputs!=null && amount>time-1 && amount<time+1);
}

function isTipNotification(tx){
  var amount = tx.incoming.value
  var time = tx.time/100000000;
  return (tx.incoming.inputs!=null && amount==15);
}

function isFavorite(tx, output){
  var amount = output.value
  var time = tx.time/100000000;
  return (amount>time-1 && amount<time+1) && amount!=15;
}

function isConnectingPost(hexToken){
  var startHexLibraryTokenRange = parseInt("00",16);
  var endHexLibraryTokenRange = parseInt("1F",16);
  return (hexToken>=startHexLibraryTokenRange && hexToken<=endHexLibraryTokenRange);
}

function isPost(hexToken){
  var startHexLibraryTokenRange = parseInt("80",16);
  var endHexLibraryTokenRange = parseInt("9E",16);
  return (hexToken>=startHexLibraryTokenRange && hexToken<=endHexLibraryTokenRange);
}

function isName(hexToken){
  var hexNameToken = parseInt("9F",16);
  return (hexToken==hexNameToken);
}
