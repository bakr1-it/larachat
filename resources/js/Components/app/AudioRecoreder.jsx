import { MicrophoneIcon , StopCircleIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
export default function AudioRecoreder({fileReady}) {

    const [recorder,setRecorder] =useState(false);
    const [mediaRecorder,setMediaRecorder] =useState(null);

const onMicrophoneClick= async()=>{
if(recorder){
    setRecorder(false);
    if(mediaRecorder){
        mediaRecorder.stop();
        setMediaRecorder(null);
    }
    return;
}
setRecorder(true);
try{
const stream = await navigator.mediaDevices.getUserMedia({audio:true  });

const newMediaRecoreder = new MediaRecorder(stream);
const chunk=[];
newMediaRecoreder.addEventListener("dataavailable",(event)=>{
    chunk.push(event.data);

})
newMediaRecoreder.addEventListener("stop",()=>{
    let audioBlob = new Blob(chunk,{type:"audio/ogg ; codecs=opus"});
    let fileAudio = new File([audioBlob],"recorder_audio.ogg",{type:"audio/ogg ; codecs=opus"});
    let url= URL.createObjectURL(fileAudio);




    fileReady(fileAudio,url);
})
newMediaRecoreder.start();
setMediaRecorder(newMediaRecoreder);


}catch(error){
    setRecorder(false);
console.log("some error while recorder voice" , error)
}
}
  return (
    <div >
        <button className="cursor-pointer"  onClick={onMicrophoneClick}>
            {recorder && <StopCircleIcon  className="w-6"/>}
            {!recorder && <MicrophoneIcon  className="w-6"/>}

        </button>

    </div>
  )
}
