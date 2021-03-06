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

function sendTransaction(outputs, usernames, keywords){
  var ajax = $.getJSON(unspentUrl+getWalletAddress());
  $.when(ajax).done(function(json){
    var unspentOutputs = json.unspent_outputs;
    if(unspentOutputs.length==0){
      alert("Transaction failed. You are probably out of dogecoins.");
    } else {
      var txb = new bitcoin.TransactionBuilder();
      var totalOutputs = outputs.length+usernames.length+keywords.length;
      var price = 100000000+(totalOutputs*105000000)
      var input = determineInput(unspentOutputs, txb, price);

      if(input!=null){
        var txHash = input.tx_hash;
        var txOutputN = input.tx_output_n;
        var value = window.dogeyip.bnFromString(input.value);

        txb.addInput(txHash, txOutputN);

        for(var i=0; i<outputs.length; i++){
          var output = outputs[i];
          txb.addOutput(output, 100000000);
        }

        if(usernames!=null){
          for(var i=0; i<usernames.length; i++){
            var outboxAddress = messageToBase58Check(usernames[i], null, "9E")[0];
            txb.addOutput(outboxAddress, 100000000);
          }
        }

        if(keywords!=null){
          for(var i=0; i<keywords.length; i++){
            var keywordAddress = messageToBase58Check(keywords[i], null, "9D")[0];
            txb.addOutput(keywordAddress, 100000000);
          }
        }

        var change = value-price;
        if(change>100000000){
          txb.addOutput(getWalletAddress(), change);
        }

        txb.sign(0, privateKey);

        jQuery.support.cors = true;
        var postTransaction = $.post(pushTxUrl, {tx_hex:txb.build().toHex()});
        $.when(postTransaction).done(function(json){
          //console.log(json);
        });
        $.when(postTransaftion).fail(function(){
          alert("Transaction failed. You are probably out of dogecoins.");
        });
      }
    }
  });
}

function sendTipTransaction(tipAddress){
  var ajax = $.getJSON(unspentUrl+getWalletAddress());
  $.when(ajax).done(function(json){
    var unspentOutputs = json.unspent_outputs;
    if(unspentOutputs.length==0){
      alert("Transaction failed. You are probably out of dogecoins.");
    } else {
      var txb = new bitcoin.TransactionBuilder();
      var price = 1600000000;
      var input = determineInput(unspentOutputs, txb, price);

      if(input!=null){
        var txHash = input.tx_hash;
        var txOutputN = input.tx_output_n;
        var value = window.dogeyip.bnFromString(input.value);

        txb.addInput(txHash, txOutputN);
        txb.addOutput(tipAddress, 1500000000);

        var change = value-price;
        if(change>100000000){
          txb.addOutput(getWalletAddress(), change);
        }
        txb.sign(0, privateKey);

        jQuery.support.cors = true;
        var postTransaction = $.post(pushTxUrl, {tx_hex:txb.build().toHex()});
        $.when(postTransaction).done(function(json){
          //console.log(json);
        });
        $.when(postTransaftion).fail(function(){
          alert("Transaction failed. You are probably out of dogecoins.");
        });
      }
    }
  });
}

function sendFavoriteTransaction(favoriteAddress, favoriteAmount){
  var ajax = $.getJSON(unspentUrl+getWalletAddress());
  $.when(ajax).done(function(json){
    var unspentOutputs = json.unspent_outputs;
    if(unspentOutputs.length==0){
      alert("Transaction failed. You are probably out of dogecoins.");
    } else {
      var txb = new bitcoin.TransactionBuilder();
      var price = 100000000+favoriteAmount*100000000;
      var input = determineInput(unspentOutputs, txb, price);

      if(input!=null){
        var txHash = input.tx_hash;
        var txOutputN = input.tx_output_n;
        var value = window.dogeyip.bnFromString(input.value);

        txb.addInput(txHash, txOutputN);
        txb.addOutput(favoriteAddress, favoriteAmount*100000000);

        var change = value-price;
        if(change>100000000){
          txb.addOutput(getWalletAddress(), change);
        }
        txb.sign(0, privateKey);

        jQuery.support.cors = true;
        var postTransaction = $.post(pushTxUrl, {tx_hex:txb.build().toHex()});
        $.when(postTransaction).done(function(json){
          //console.log(json);
        });
        $.when(postTransaftion).fail(function(){
          alert("Transaction failed. You are probably out of dogecoins.");
        });
      }
    }
  });
}

function determineInput(unspentOutputs, txb, price){
  /*
  * Bit of a hack but I am having trouble spending from multiple inputs
  * So lets try to spend the smallest input that is large enough to make the transaction
  */
  var value = 0;
  var unspentOutput=null;
  for(var i=0; i<unspentOutputs.length; i++){
    var inputValue = window.dogeyip.bnFromString(unspentOutputs[i].value);
    if(inputValue>price && (value==0 || inputValue<value)){
      value = inputValue;
      unspentOutput = unspentOutputs[i];
    }
  }
  if(unspentOutput==null){
    alert("Transaction failed. You do not have enough dogecoins to do this.");
  }
  return unspentOutput;
}
