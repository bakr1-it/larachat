
import { PaperClipIcon } from "@heroicons/react/24/solid"
import  {isPdf,formatBytes ,isPreviewble} from "@/helpers"
export default function CustomPreviewAttachment({file}) {

  return (
    <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
        {isPdf(file.file) && <img src="img/pdf.png" alt="" className="w-8" /> }
        {!isPreviewble(file.file) && <div className="flex justify-center items-center w-10 h-10 bg-slate-700 rounded-md">
            <PaperClipIcon className="w-6 h-6" /></div> }
            <div className="flex-1 text-ellipsis overflow-hidden text-nowrap text-gray-400">
                <h1>{file.file.name}</h1>
                <p className="text-xs">{formatBytes(file.file.size)}</p>

            </div>


    </div>
  )
}
