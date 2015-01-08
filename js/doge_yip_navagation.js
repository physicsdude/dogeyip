links=["favorite","index","language","post","profile","search","setname","bigqrcode"];

function showLink(link){
  var on;
  for(var i=0; i<links.length; i++){
    if(link!=links[i]){
      $("."+links[i]).hide();
    }
    $("."+link).show();
  }
}
