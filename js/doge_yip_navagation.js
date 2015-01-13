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

  $(".index").show();

/* LOAD FAVORITE HTML */
$.ajax({
  url: "html/favorite.html",
  dataType: 'html'
}).done(function(html) {
  $("#favoritearticle").html(html);
});

/* LOAD SETTINGS HTML */
$.ajax({
  url: "html/settings.html",
  dataType: 'html'
}).done(function(html) {
  $("#settingsarticle").html(html);
});

  $(".indexlink").click(function( event ) {
    showLink("index");
  });

$(".settingslink").click(function( event ) {
  $('#dogeyip_api').click(function( event ){
    baseUrl='http://api-dogeyip.rhcloud.com/?address=';
  });
  $('#chain_api').click(function( event ){
    baseUrl='https://chain.so/api/v2/address/DOGE/';
  });
  if(baseUrl=='http://api-dogeyip.rhcloud.com/?address='){
    $('#dogeyip_api').attr('checked',true);
  }
  if(baseUrl=='https://chain.so/api/v2/address/DOGE/'){
    $('#chain_api').attr('checked',true);
  }

  $('#english_language').click(function( event ){
    dictionaryChoice='english_dictionary_decode.json';
  });
  if(dictionaryChoice=='english_dictionary_decode.json'){
    $('#english_language').attr('checked',true);
  }

  showLink("settings");
});

  $(".postlink").click(function( event ) {
    showLink("post");
  });

  $(".profilelink").click(function( event ) {
    showLink("profile");
  });

  $(".searchlink").click(function( event ) {
    showLink("search");
  });

  $(".setnamelink").click(function( event ) {
    showLink("setname");
  });

  $(".bigqrcode").click(function( event ) {
    showLink("bigqrcode");
  });

var faqarticle;
$(".faqlink").click(function( event ) {
  if(faqarticle!=null){
    $("#faqarticle").html(html);
    showLink("faq");
  } else{
    $.ajax({
      url: "html/faq.html",
      dataType: 'html'
    }).done(function(html) {
      faqarticle = html;
      $("#faqarticle").html(faqarticle);
      showLink("faq");
    });
  }
});
