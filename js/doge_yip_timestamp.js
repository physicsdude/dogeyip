function timestamp(time){
  var date = new Date(time*1000);
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = ("0" + date.getMinutes());
  minutes = minutes.substr(minutes.length-2);
  var seconds = "0" + date.getSeconds();
  seconds = seconds.substr(seconds.length-2);

  var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  };

  return date.toLocaleTimeString("en-us", options);
}
