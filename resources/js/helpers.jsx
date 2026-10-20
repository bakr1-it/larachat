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
const isImg = (attachment)=>{
    let mime = attachment.type || attachment?.mime;
    mime = String(mime);
    return mime.split("/")[0].toLowerCase() === "image";
}
const isAudio = (attachment)=>{
    let mime= attachment.mime || attachment.type;
    mime = String(mime).toLocaleLowerCase();
  return mime.startsWith("audio/") || mime === "application/ogg";
}
const isVideo = (attachment)=>{
    let mime= attachment.type || attachment?.mime ;
    mime= mime.split("/")[0].toLowerCase();
    return mime === "video";
}
const isPdf = (attachment)=>{
return (attachment.type || attachment.mime).toLowerCase() === "application/pdf";
}
const isPreviewble = (attachment)=>{
    return (
        isAudio(attachment) ||
        isImg(attachment) ||
        isPdf(attachment)||
        isVideo(attachment)
    );
}
const formatBytes = (byte , decimal =2)=>{
if(byte == 0) return "0 Bytes";
const k =1024;
const dm = decimal <=0 ?0 :decimal;
const sizes= ["Bytes","KB", "MB", "GB"]
let i =0;
let size = byte;
while(byte >= k ){
    byte /= k;
    i++;

}
return parseFloat(size.toFixed(dm)) + ' '+ sizes[i];
}
 function showTimeForAudioOrVido(totalSeconds) {
if(!totalSeconds  || isNaN(totalSeconds) || totalSeconds < 0){
    return "00:00";
}
const hours= Math.floor(totalSeconds / 3600);
const minute= Math.floor((totalSeconds % 3600) / 60);
const second = Math.floor(totalSeconds % 60);
const formatForMinute= String(minute).padStart(2,'0');
const formatForSecond= String(second).padStart(2,'0');
if(hours > 0){
    const formatForHours= String(hours).padStart(2,'0');
    return `${formatForHours}:${formatForMinute}:${formatForSecond}`
}
return `${formatForMinute}:${formatForSecond}`

}
export {isAudio ,isImg , isPdf , formatBytes , isPreviewble , isVideo ,showTimeForAudioOrVido}
