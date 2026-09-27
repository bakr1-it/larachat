import { useEffect, useState } from "react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    XCircleIcon
} from "@heroicons/react/24/solid";
import NewMessageInput from "./NewMessageInput";
import { Popover } from "@headlessui/react";
import EmojiPicker from "emoji-picker-react";
import { isAudio, isImg, } from "@/helpers";
import CustomPreviewAttachment from "./CustomPreviewAttachment";
import CustomAudioPlayer from "./CustomAudioPlayer";
import { v4 as uuidV4 } from "uuid";
const MessageInput = ({ conversation = null }) => {

    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [uploadProgressBar,setUploadProgressBar] = useState(0);
/**
 * todo create function and use state for attachment
 */
const [chosenFile ,setChosenFile] = useState([]);
const onFileChange= (ev)=>{
    const files = ev.target.files;

const updateFile =[...files].map((file)=>{
    return {
        id:uuidV4() ,
         file,
         url:URL.createObjectURL(file)

    }

})

setChosenFile((prevFile)=>{
    return [...prevFile , ...updateFile]
})
}

useEffect(()=>{
console.log(chosenFile)
},[chosenFile])
/**
 * ! end create function and use state for attachment
 */


    /**
     *
     * todo add emjo to message
     *
     */
    const handleEmojiClick = (ev)=>{
        setNewMessage(newMessage + ev.emoji);

    }
    const onLikeClick = ()=>{
        if(messageSending)return;
        const data={
        message:"👍"
        }
          if(conversation.is_user){
              data["receiver_id"]=conversation.id;
            }else if(conversation.is_group){
                data["group_id"]=conversation.id;
            }
                window.axios.post(route("message.store") ,data)

    }
    const onSendClick = ()=>{
        if(messageSending)return;



        if(newMessage.trim() == "" && chosenFile.length ==0){
            setInputErrorMessage("please write message or upload photo or file");
            setTimeout(()=>{
                setInputErrorMessage("");
            },3000)
            return;

        };
            const fd= new FormData ();
            chosenFile.forEach((file)=>{fd.append("attachments[]",file.file)});
            fd.append("body",newMessage);
            if(conversation.is_user){
                fd.append("receiver_id",conversation.id);
            }else if(conversation.is_group){
                fd.append("group_id",conversation.id);

            }
            setMessageSending(true);

            window.axios.post(route("message.store"),fd,{
                onUploadProgress : (uep)=>{
                    const progress =uep.loaded / uep.total * 100;
                    setUploadProgressBar(progress);

                }
            }).then((res)=>{

                setNewMessage("");
                setMessageSending(false);

            }).catch((error)=>{
                setMessageSending(false);
                const message = error?.reponse?.data.message;
                setInputErrorMessage(message || "Oopps occurred Error while sending message");


            }).finally(()=>{
                     setChosenFile([]);
                setUploadProgressBar(0);
            })






    }

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">

            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">

                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>


                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>


            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSendClick}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                    />
                    <button
                    disabled={messageSending}
                    onClick={onSendClick} className="btn btn-info rounded-l-none">
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Send </span>
                    </button>
                </div>

                {inputErrorMessage && (
                    <div className="text-red-500 text-xs mt-1">
                        {inputErrorMessage}
                    </div>
                )}
                {!!uploadProgressBar && <progress className="progress progress-info w-full" value={uploadProgressBar} max="100"></progress>}
            </div>
            <div className="order-4 w-full flex flex-wrap gap-2 mt-2 px-3">
                {chosenFile.map((file)=>{
                    return (

                        <div
                        key={file.file.name}
                        className={`relative flex justify-between cursor-pointer ${!isImg(file.file) ?"w-[240px]" : ""}`}>
                            {isImg(file.file) && <img  src={file.url} className="w-16 h-16 object-cover" />}
                            {isAudio(file.file) && <CustomAudioPlayer file={file} showVolume={false} />}
                            {!isAudio(file.file) && !isImg(file.file) && <CustomPreviewAttachment file={file}/>}
                            <button
                            className="absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10"
                             onClick={()=> setChosenFile((prevChoseFile)=> prevChoseFile.filter((f)=>f.id !== file.id ))}
                            >
                <XCircleIcon className="w-6 h-6" />
                            </button>


                        </div>

                    )
                })}

            </div>

            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300">
      <FaceSmileIcon className="w-6 h-6" />
    </Popover.Button>
    <Popover.Panel className="absolute z-10 right-0 bottom-full">
      <EmojiPicker
        theme="dark"
        onEmojiClick={handleEmojiClick}
      />
    </Popover.Panel>



                </Popover>

                <button className="p-1 text-gray-400 hover:text-gray-300">
                    <HandThumbUpIcon className="w-6 h-6 cursor-pointer" onClick={onLikeClick}  />
                </button>
            </div>
        </div>
    );


}
export default MessageInput;
