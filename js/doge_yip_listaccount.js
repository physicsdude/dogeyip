function listAccount(accountAddress){
  var qrcode = "https://dogechain.info/api/v1/address/qrcode/"+accountAddress;
  var profile = "profile.html?user="+accountAddress;
  var result = "<div class='container'>"
               + "<a class='profilelink' href='"+profile+"'>"
               + "<img style='vertical-align:middle;' width=35px height=35px src='"+qrcode+"'></img>"
               + "<span><font class="+accountAddress+" style='font-size: 175%; vertical-align:middle;'>&nbsp;"+accountAddress+"</font></span>"
               + "</a>"
               + "</div>";
  $("#results").append(result);
  scrapeTransactionData(accountAddress);
}
