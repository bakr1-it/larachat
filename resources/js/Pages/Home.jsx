import { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

function Home({ selectedConversation = null, messages = null }) {

    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);

    useEffect(() => {
        setLocalMessages(messages==null ? [] : messages.data.reverse());
    }, [messages]);

    useEffect(() => {
        if (messagesCtrRef.current) {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
        }
    }, [localMessages]);

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
                            className="flex-1 overflow-y-auto p-5"
                        >
                                                {localMessages.length === 0 && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-lg text-slate-200">
                                        No messages found
                                    </div>
                                </div>
                            )}


                            {localMessages.length > 0 && (
                                <div className="flex-1 flex flex-col gap-2">
                                    {localMessages.map((message) => (
                                        <MessageItem
                                            key={message.id}
                                            message={message}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <MessageInput conversation={selectedConversation} />
                    </>
                )}
            </div>
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
