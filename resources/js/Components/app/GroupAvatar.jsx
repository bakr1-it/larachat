import { UsersIcon } from "@heroicons/react/24/solid";

const GroupAvatar = ({}) => {
    return (
        <>
            <div className={`avatar placeholder`}>
                <div className={`bg-gray-400 text-gray-800 rounded-full w-8 justify-center flex items-center `}>
                    <span className="text-xl text-center">
                        <UsersIcon className="w-4" />
                    </span>
                </div>
            </div>
        </>
    );
};

export default GroupAvatar;
