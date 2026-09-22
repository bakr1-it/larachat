export const formatMessageDate = (date , type)=>{
const now = new Date();
const inputDate= new Date(date);



if(isToday(inputDate)){
    return inputDate.toLocaleTimeString( [], {
        minute:"2-digit",
        hour:"2-digit",
    })

}else if(isYestarday(inputDate)){
    if(type== "long"){
        return "Yesterday" + inputDate.toLocaleTimeString([],{
         minute:"2-digit",
      hour:"2-digit",
        })

    }else if(type=="short"){
  return "Yesterday";
    }

}else if(inputDate.getFullYear() == now.getFullYear()){
return inputDate.toLocaleDateString([],{
    day:"2-digit",
    month:"short"
});

}else{
    return inputDate.toLocaleDateString();
}





}
 function isToday(date){

const now= new Date();
const inputDate= new Date(date);
return inputDate.getDay() == now.getDay() && inputDate.getMonth() == now.getMonth() && inputDate.getFullYear() == now.getFullYear();

}
function isYestarday(date){
    const now = new Date();
    const inputDate = new Date(date)
    inputDate.setDate(inputDate.getDate()-1);
    return inputDate.getDay() == now.getDay() && inputDate.getMonth() == now.getMonth() && inputDate.getFullYear() == now.getFullYear();
}
