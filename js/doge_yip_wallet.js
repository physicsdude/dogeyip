var unspentUrl = "https://dogechain.info/api/v1/unspent/";
var pushTxUrl = "https://chain.so/api/v2/send_tx/DOGE";
var privateKey;

function setPrivateKey(){
  var walletemail = $("#walletemail").val();
  var walletpassword = $("#walletpassword").val();
  var password = walletemail+walletpassword;
  var passwordBuffer = dogeyip.buffer(password);
  var passwordHash = bitcoin.crypto.sha256(passwordBuffer);
  var passwordBN = window.dogeyip.bnFromBuffer(passwordHash);
  privateKey = new bitcoin.ECKey(passwordBN);
  $("#postCodeTable").hide()
  $("#postButton").show()
  $("#setnameCodes").hide()
  $("#setNameButton").show()
  $('#message').off("keyup");
  $('#setnameinput').off("keyup");
}

function getWalletWIF(){
  return privateKey.toWIF(bitcoin.networks.dogecoin);
}

function getWalletAddress(){
  return privateKey.pub.getAddress(bitcoin.networks.dogecoin);
}

function sendTransaction(outputs){
  var ajax = $.getJSON(unspentUrl+getWalletAddress());
  $.when(ajax).done(function(json){
    var unspentOutputs = json.unspent_outputs[0];
    if(unspentOutputs==null){
      alert("Transaction failed. You are probably out of dogecoins.");
    } else {
      var txHash = unspentOutputs.tx_hash;
      var txOutputN = unspentOutputs.tx_output_n;
      var value = window.dogeyip.bnFromString(unspentOutputs.value);

      var txb = new bitcoin.TransactionBuilder();
      txb.addInput(txHash, txOutputN);
      for(var i=0; i<outputs.length; i++){
        var output = outputs[i];
        txb.addOutput(output, 100000000);
        value-=100000000;
      }

      var change = value-100000000-(outputs.length/20)*100000000;
      if(change>100000000){
        txb.addOutput(getWalletAddress(), change);
      }
      txb.sign(0, privateKey);

      jQuery.support.cors = true;
      var postTransaction = $.post(pushTxUrl, {tx_hex:txb.build().toHex()});
      $.when(postTransaction).done(function(json){
        console.log(json);
      });
    }
  });
}

function sendTipTransaction(tipAddress){
  var ajax = $.getJSON(unspentUrl+getWalletAddress());
  $.when(ajax).done(function(json){
    var unspentOutputs = json.unspent_outputs[0];
    if(unspentOutputs==null){
      alert("Transaction failed. You are probably out of dogecoins.");
    } else {
      var txHash = unspentOutputs.tx_hash;
      var txOutputN = unspentOutputs.tx_output_n;
      var value = window.dogeyip.bnFromString(unspentOutputs.value);

      var txb = new bitcoin.TransactionBuilder();
      txb.addInput(txHash, txOutputN);
      txb.addOutput(tipAddress, 1500000000);
      value-=1500000000;

      var change = value-100000000;
      if(change>100000000){
        txb.addOutput(getWalletAddress(), change);
      }
      txb.sign(0, privateKey);

      jQuery.support.cors = true;
      var postTransaction = $.post(pushTxUrl, {tx_hex:txb.build().toHex()});
      $.when(postTransaction).done(function(json){
        console.log(json);
      });
    }
  });
}

function sendFavoriteTransaction(favoriteAddress, favoriteAmount){
  var ajax = $.getJSON(unspentUrl+getWalletAddress());
  $.when(ajax).done(function(json){
    var unspentOutputs = json.unspent_outputs[0];
    if(unspentOutputs==null){
      alert("Transaction failed. You are probably out of dogecoins.");
    } else {
      var txHash = unspentOutputs.tx_hash;
      var txOutputN = unspentOutputs.tx_output_n;
      var value = window.dogeyip.bnFromString(unspentOutputs.value);

      var txb = new bitcoin.TransactionBuilder();
      txb.addInput(txHash, txOutputN);
      txb.addOutput(favoriteAddress, favoriteAmount*100000000);
      value-=favoriteAmount*100000000;

      var change = value-100000000;
      if(change>100000000){
        txb.addOutput(getWalletAddress(), change);
      }
      txb.sign(0, privateKey);

      jQuery.support.cors = true;
      var postTransaction = $.post(pushTxUrl, {tx_hex:txb.build().toHex()});
      $.when(postTransaction).done(function(json){
        //console.log(json);
      });
    }
  });
}
