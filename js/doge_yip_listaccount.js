function listAccount(accountAddress){
  var profile = "profile.html?user="+accountAddress;
  var result = "<div class='container'>"
               + "<a href='"+profile+"'>"
               + "<img style='vertical-align:middle;' width=35px height=35px src='https://useiconic.com/iconic/svg/bitcoin-address.svg'></img>"
               + "<span><font class="+accountAddress+" style='font-size: 175%; vertical-align:middle;'>&nbsp;"+accountAddress+"</font></span>"
               + "</a>"
               + "</div><br/>";
  $("#results").append(result);
  $("#recentusers").append(result);
  scrapeTransactionData(accountAddress);
}
