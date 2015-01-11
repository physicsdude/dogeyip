links=["favorite","index","settings","post","profile","search","setname","bigqrcode","faq"];

function showLink(link){
  var on;
  for(var i=0; i<links.length; i++){
    if(link!=links[i]){
      $("."+links[i]).hide();
    }
    $("."+link).show();
  }
}
