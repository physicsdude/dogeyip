function inArray(array, value){
  if(array==null){
    return false;
  }
  for(var i=0; i<array.length; i++){
    //console.log(""+array[i]+"=="+value+" "+(array[i]==value))
    if(array[i]==value){
      return true;
    }
  }
  return false;
}
