import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
    EllipsisVerticalIcon, TrashIcon,

} from "@heroicons/react/24/solid";
import axios from "axios";
import { useEvent } from "@/context/EventBus";
export default function MessageOptionDropDown({ message }) {
const {emit} = useEvent()
    const onDeleteMessage = ()=>{
    if(!message) return ;
    axios.delete(route("message.destory",message.id))
    .then((data)=>{
        emit("message.deleted",{ message:message, prevMessage : data.data.prevMessage});

        }
    )
    .catch((error)=>{console.log(error)})

}


    return (
        <div onClick={(e)=>{

            e.stopPropagation()
            e.preventDefault()

        }}
        className="top-1/2 absolute right-full text-gray-200 -translate-y-1/2 z-30"
        >
            <Menu as="div" className="relative inline-block text-left left-0">
                <div>
                    <Menu.Button className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onDeleteMessage}
                                        className={`${
                                            active
                                                ? "bg-black/30 text-white "
                                                : "text-gray-100"
                                        } group flex w-full items-center rounded-md px-2 gap-2 py-2 text-sm`}
                                    >
                                        <TrashIcon className="w-6 h-6"/> Delete

                                    </button>
                                )}
                            </Menu.Item>
                        </div>

                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
