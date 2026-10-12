import { useEvent } from "@/context/EventBus"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Toast() {
const {on} = useEvent();
const [toasts,setToasts] = useState([]);
useEffect(()=>{
on("toast.show",(message)=>{
    const id=uuidv4();
    setToasts((prev) => [...prev , {message , id}]);
    setTimeout(() => {
setToasts((prev)=> prev.filter((toast)=> toast.id !== id));
    }, 3000);

})
},[on])
  return (
<div className="toast min-w-[280px] toast-top toast-end z-50" >
    {toasts.map((toast)=> (
        <div
        key={toast.id}
            className="alert alert-success text-gray-100 rounded-lg ">
          <span> {toast.message}</span>
        </div>

))}
</div>

  )
}

