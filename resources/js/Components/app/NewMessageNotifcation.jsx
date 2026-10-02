import { useEvent } from "@/context/EventBus"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";

export default function Toast() {
const {on} = useEvent();
const [toasts,setToasts] = useState([]);
useEffect(()=>{
on("newMessageNotification",({content, user , group_id})=>{
    const id=uuidv4();
    setToasts((prev) => [...prev , {content , id , group_id , user} ]);
    setTimeout(() => {
 ((prev)=> prev.filter((toast)=> toast.id == id));
    }, 5000);

})

},[on])

  return (
<div className="toast min-w-[280px] toast-top toast-start z-50" >
    {toasts.map((toast)=> (
        <div
        key={toast.id}
            className="alert alert-success text-gray-100 rounded-lg ">
                <Link
                href={
                    toast.group_id
                  ? route("chat.group",toast.group_id)
                  : route("chat.user",toast.user)

                }


className="flex items-center gap-2"
>
                    <UserAvatar user={toast.user}/>
                    <span className="font-bold text-gray-600">{toast.content}</span>

                </Link>
          <span> {toast.message}</span>
        </div>

))}
</div>

  )
}

