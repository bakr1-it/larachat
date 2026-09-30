import {
    PaperClipIcon ,
    PlayCircleIcon,
    ArrowDownCircleIcon }
    from "@heroicons/react/24/solid"

    import
    {   isAudio,
        isImg,
        isPdf,
        isVideo,
        formatBytes,
        isPreviewble,}
         from "@/helpers"
import CustomAudioPlayer from "./CustomAudioPlayer"

export default function MessageAttachment({attachments ,attachmentClick}) {
  return (
    <div className="overflow-hidden px-2">
{attachments.length >0 && (
    <div className="mt-2 flex flex-wrap justify-end gap-1">
        {attachments.map((attachment , ind)=>{
            return <div
     onClick={() => {
    if (isAudio(attachment)) return;
    attachmentClick(attachment, ind);
}}
            key={attachment.id}
            className={`
                group flex flex-col justify-center items-center text-gray-500 relative cursor-pointer
                ` + (isAudio(attachment) ? "w-48":"w-32 aspect-square bg-blue-100" )}


            >
                {!isAudio(attachment) && (
    <a
        onClick={(ev) => ev.stopPropagation()}
        download
        href={attachment.url}
        className="
        z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center
        justify-center text-gray-100 bg-gray-700 rounded
         absolute right-0 top-0 cursor-pointer hover:bg-gray-800"
    >
        <ArrowDownCircleIcon className="w-4 h-4" />


    </a>
)}
{isImg(attachment) && (
    <img
        src={attachment.url}
        className="object-contain aspect-square"
    />
)}
{isVideo(attachment) && (
    <div className="relative flex justify-center items-center">
        <PlayCircleIcon className="z-20 absolute w-16 h-16 text-white opacity-70" />

        <div className="absolute left-0 top-0 w-full h-full bg-black/50 z-10"></div>
        <video src={attachment.url}></video>
    </div>
)}
{isAudio(attachment) && (
       <CustomAudioPlayer file={attachment} showVolume={false} />
)}
{isPdf(attachment) && (
    <div className="relative flex justify-center items-center">
        <div className="absolute left-0 top-0 right-0 bottom-0"></div>
        <iframe
            src={attachment.url}
            className="w-full h-full"
        ></iframe>
    </div>
)}
{!isPreviewble(attachment) &&(
<a
onClick={(e)=>e.stopPropagation()}
download
className="flex justify-center items-center flex-col"
href={attachment.url}


>
    <PaperClipIcon className="w-6 h-6 mb-3" />
    <small className="text-center break-all line-clamp-2 px-2">{attachment.name}</small>
    </a>
)



    }


            </div>
        })}

    </div>
)}

    </div>
  )
}
