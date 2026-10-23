
import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";
import { router, usePage } from "@inertiajs/react";
import { useEvent } from "@/context/EventBus";
import GroupModal from "@/Components/App/GroupModal";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations || [];
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showGroupModal  ,setShowGroupModal] =useState(false);

    /**
     * todo update last message
     *
     */
    const {on,emit}= useEvent();

    const messageCreated = (message)=>{
        setLocalConversations((preLocalConversation)=>{
             return preLocalConversation.map((conversation)=>{
                if(message.receiver_id && !conversation.is_group && (conversation.id==message.receiver_id || conversation.id==message.sender_id)){
                    conversation.last_message=message.body;
                    conversation.last_message_date= message.created_at;
                    return conversation;

                }if(message.group_id && conversation.is_group && conversation.id == message.group_id){
                    conversation.last_message=message.body;
                    conversation.last_message_date= message.created_at;
                    return conversation;

                }
                return conversation;

            })
        })
    }
    function messageUpdated( {prevMessage}){
if(!prevMessage)return;
messageCreated(prevMessage);

    }
       const onDeleteGroup = ({id,name})=>{
        setLocalConversations((prevCOnversation)=>{
            return prevCOnversation.filter((conv)=> !(conv.is_group && conv.id ==id) )
        })
        emit ("toast.show", `group deleted was name ${name} successfuly`);

            router.visit(route("dashboard"));
        }




    useEffect(()=>{
        const offCreatedMessages= on("message.created",messageCreated);
        const offUpdateedLastMessage= on("message.deleted",messageUpdated)
        const offShowGroup = on("GroupModal.show", () => {
        setShowGroupModal(true);
    });
    const offDeleteGroup = on("group.delete",onDeleteGroup);


        return ()=>{
            offCreatedMessages();
            offUpdateedLastMessage();
            offShowGroup();
            setShowGroupModal();
            offDeleteGroup();

        }
    },[on]);
    /**
     *
     * ! end update last message
     *
     */
    const isUserOnline = (userId) => !!onlineUsers[userId];

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
    };

    useEffect(() => {
        setLocalConversations(conversations );
    }, [conversations]);

    useEffect(() => {
        setSortedConversations(
            [...localConversations].sort((a, b) => {
                if (a.blocked_at && !b.blocked_at) {
                    return 1;
                }
                if (!a.blocked_at && b.blocked_at) {
                    return -1;
                }
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        if (typeof Echo !== "undefined") {
            Echo.join("online")
                .here((users) => {
                    const onlineUsersObj = Object.fromEntries(
                        users.map((user) => [user.id, user])
                    );
                    setOnlineUsers((prevOnlineUsers) => {
                        return { ...prevOnlineUsers, ...onlineUsersObj };
                    });
                })
                .joining((user) => {
                    console.log("join");
                    setOnlineUsers((prevOnlineUsers) => {
                        const updatedUsers = { ...prevOnlineUsers };
                        updatedUsers[user.id] = user;
                        return updatedUsers;
                    });
                })
                .leaving((user) => {
                    setOnlineUsers((prevOnlineUsers) => {
                        const updatedUsers = { ...prevOnlineUsers };
                        delete updatedUsers[user.id];
                        return updatedUsers;
                    });
                })
                .error((error) => {
                    console.error("error", error);
                });

            return () => {
                Echo.leave("online");
            };
        }
    }, []);

    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div
                    className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden ${
                        selectedConversation ? "-ml-[100%]  sm:ml-0" : ""
                    }`}
                >
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium text-gray-200">
                        My Conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new Group"
                        >
                            <button onClick={()=>setShowGroupModal(true)} className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and groups"
                            className="w-full py-1 px-2"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    }${conversation.id}`}
                                    conversation={conversation}
                                    online={!!isUserOnline(conversation.id)}
                                      selectedConversation={selectedConversation}
                                />
                            ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>
            <GroupModal  show={showGroupModal} onClose={()=>setShowGroupModal(false)}/>
        </>
    );
};


export default ChatLayout;
