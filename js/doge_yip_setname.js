function populateSetNameQrCode(qrcode){
  var message = $("#setnameinput").val();
  var base58Check = messageToBase58Check(message, null, "9F");
  if(message.length<3){
    $(".qrUnavailable").show();
    $("#setnameQRPostCode").hide();
    $("#setnamebase58Check").val("Compressed message is too short");
  } else if(base58Check==null || base58Check.length>1){
    $(".qrUnavailable").show();
    $("#setnameQRPostCode").hide();
    $("#setnamebase58Check").val("Compressed message is too long");
  } else{
    $(".qrUnavailable").hide();
    $("#setnameQRPostCode").show();
    qrcode.clear();
    qrcode.makeCode(base58Check[0]);
    $("#setnamebase58Check").val(base58Check[0]);
  }
}
