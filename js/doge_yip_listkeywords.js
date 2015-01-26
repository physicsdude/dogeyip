function listKeywordPosts(searchTerm, divId){
  if(searchTerm.length>2){
    var dictionary = null;
    var dictionaryHex = "9D"
    var address = messageToBase58Check(searchTerm, dictionary, dictionaryHex);
    getSearch(address).done(function(results){
      for(var i=0; i<results.length; i++){
        listKeywordPostsPerUser(results[i], searchTerm, divId);
      }
    });
  }
}

function listKeywordPostsPerUser(address, searchTerm, divId){
  $.when(getUser(address)).done(function(user){
    for(var i=0; i<user.posts.length; i++){
      var post = user.posts[i];
      if(user.username!=user.address){
        var when = $.when(hash160ToText(post.hexMessage, post.hexToken, user.connectingPosts))
        when.done(function(message){
          if(message.indexOf("#"+searchTerm) > -1){
            createPost(divId, user.username, user.address, post.time, post.hexMessage, post.hexToken, user.connectingPosts, "html/posts/yip.html")
          }
        });
      }
    }
  });
}
