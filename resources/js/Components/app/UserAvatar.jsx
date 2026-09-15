const UserAvatar = ({ user, online = null, profile = false }) => {
    let onlineClass =
        online === true ? "online" : online === false ? "offline" : "";

    const sizeClass = profile ? "w-40" : "w-8";

    return (
        <>
            {user.avatar_url && (
                <div className={`chat-image avatar ${onlineClass} flex justify-center items-center`}>
                    <div className={`rounded-full ${sizeClass}`}>
                        <img src={user.avatar_url} />
                    </div>
                </div>
            )}
            {!user.avatar_url && (
      <div className={`chat-image avatar placeholder relative`}>
    <div className={`bg-gray-400 text-gray-800 rounded-full ${sizeClass} flex items-center justify-center`}>
        <span className="text-xl leading-none">
            {user.name.substring(0, 1)}
        </span>
    </div>
    {online === true && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></span>}
    {online === false && <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-slate-800"></span>}
</div>
            )}
        </>
    );
};

export default UserAvatar;
