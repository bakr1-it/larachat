import { useEffect, useState, useRef, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useEvent } from '@/context/EventBus';
import AttachmentPreviewModal from '@/Components/App/AttachmentPreviewModal';
function Home({ selectedConversation = null, messages = null }) {

    const [localMessages, setLocalMessages] = useState([]);
    const {on}= useEvent();
    const messagesCtrRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const [scrollFromBottom,setScrollFromBottom]= useState(0);
    const [noMoreMessages,setNoMoreMessages] = useState(false);
    const [previewAttachment,setPreviewAttachment] = useState({});
    const [showAttachmentPreivew,setShowAttachmentPreivew]= useState(false);

    const loadMessagesMore = useCallback(()=>{
        const firstMessage= localMessages[0];
        if(noMoreMessages)return;

        window.axios.get(route("message.loadOlder",firstMessage.id))
        .then((data)=>{
            const loadMessages=data.data.data;
            if(loadMessages.length ==0){

                setNoMoreMessages(true);
                return;
            }
            const scrollHeight= messagesCtrRef.current.scrollHeight;
            const scrollTop= messagesCtrRef.current.scrollTop;
            const clientHeight= messagesCtrRef.current.clientHeight;
            const tempScrollFromBottom = scrollHeight- scrollTop-clientHeight;
            setScrollFromBottom(tempScrollFromBottom);
            setLocalMessages((prevMessage)=>[...loadMessages.reverse() , ...prevMessage]);



        }).catch((error)=>{
            console.log("error from get data in file home.jsx" );
            console.log(error);
        })



    },[localMessages]);


    function messageCreated(message){
        if(selectedConversation && selectedConversation.is_group && selectedConversation.id == message.group_id){
            setLocalMessages((prevMessage)=>[...prevMessage , message]);
        }else if(selectedConversation && selectedConversation.is_user && (selectedConversation.id == message.sender_id || selectedConversation.id== message.receiver_id)){
            setLocalMessages((prevMessage)=>[...prevMessage , message]);

        }

    }


const onAttachmentClick =(attachments ,ind)=>{
    setPreviewAttachment({
        attachments,
        ind,
    })
    setShowAttachmentPreivew(true);

}

    useEffect(()=>{
        if(messagesCtrRef.current && scrollFromBottom !== 0){

            messagesCtrRef.current.scrollTop =
            messagesCtrRef.current.scrollHeight-
            messagesCtrRef.current.clientHeight -
            scrollFromBottom;
        }
        if(noMoreMessages)return;
        if (!messagesCtrRef.current) return;
        const observer= new IntersectionObserver (

            (enters)=>
                enters.forEach((enter)=> enter.isIntersecting && loadMessagesMore()
        ),
        {
            root: messagesCtrRef.current,
            rootMargin : "250px 0px 0px 0px"

        }



        )
             if(loadMoreIntersect.current){
                observer.observe(loadMoreIntersect.current);
             }
             return ()=> observer.disconnect()





    },[localMessages,noMoreMessages])


    useEffect(() => {
        setLocalMessages(messages==null ? [] : messages.data.reverse());
    }, [messages]);
    useEffect(() => {
        if(messagesCtrRef.current && scrollFromBottom==0){

            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
        }

    }, [localMessages]);
useEffect(()=>{
        const offCreated = on("message.created",messageCreated);
        return ()=>{
            offCreated();
        }
},[on,messageCreated])

return (
        <>
            <Head title={selectedConversation ? (selectedConversation.name) : "Chat"} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {!messages && (
                    <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                        <div className="text-2xl md:text-4xl p-16 text-slate-200">
                            Please select conversation to see messages
                        </div>
                        <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block text-slate-200" />
                    </div>
                )}

                {messages && (
                    <>
                        <ConversationHeader selectedConversation={selectedConversation} />

                        <div
                            ref={messagesCtrRef}
                            className="flex-1 overflow-y-auto p-5 messagesCtrRef"
                        >
                                                {localMessages.length === 0 && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-lg text-slate-200">
                                        No messages found
                                    </div>
                                </div>
                            )}


                            {localMessages.length > 0 && (
                                <div
                                className="flex-1 flex flex-col gap-2">
                                    <div ref={loadMoreIntersect}></div>
                                    {localMessages.map((message) => (
                                        <MessageItem
                                           attachmentClick={onAttachmentClick}
                                            key={message.id}
                                            message={message}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <MessageInput conversation={selectedConversation}  />
                    </>
                )}
            </div>
            {previewAttachment.attachments && (


                <AttachmentPreviewModal
      attachments={previewAttachment.attachments}
        index={previewAttachment.ind}
        show={showAttachmentPreivew}
        onClose={() => setShowAttachmentPreivew(false)}
                />
            )}
        </>
    );
}

Home.layout = (page) => (
    <AuthenticatedLayout>
        <ChatLayout>
            {page}
        </ChatLayout>
    </AuthenticatedLayout>
);

export default Home;
