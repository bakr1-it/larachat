import  { useEffect, useState } from 'react'

 function ChatLayout({children}) {
    const [onlineUser , setOnlineUser]=useState({});
    useEffect(()=>{
        window.Echo.join("online")
        .here((users)=>{
            const hereOnlineUser= Object.fromEntries(
                users.map((user)=>[user.id , user])
            );

            setOnlineUser((prevOnlineUser)=>{
return {...prevOnlineUser , hereOnlineUser}
            });


        }).joining((user)=>{
setOnlineUser((prevOnlineUser)=>({
    ...prevOnlineUser,
    [user.id]:user
}))
        })
        .leaving((user)=>{
            const update= {...onlineUser};
            delete update[user.id];
            setOnlineUser(update);



        }).error((err)=>{console.log(err)})
         return ()=> window.Echo.leave("online")

    },[])
  return (
    <>
        chat layou
        <div>
            {children}
        </div>

    </>
  )
}

export default ChatLayout
