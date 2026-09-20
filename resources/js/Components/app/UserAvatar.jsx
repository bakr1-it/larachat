const UserAvatar = ({ user, online , profile = false }) => {
    let onlineClass =
        online  ? " avatar-online" :"avatar-offline" ;

    const sizeClass = profile ? "w-40" : "w-8";
    return (
        <>
            {user.avatar_url && (
                <div className={`chat-image avatar ${onlineClass} ${onlineClass =="avatar-online" ?"animate-bounce": ""}  flex justify-center items-center`}>
                    <div className={`rounded-full ${sizeClass}`}>
                        <img src={user.avatar_url} />
                    </div>
                </div>
            )}
            {!user.avatar_url && (
      <div className={`chat-image avatar  ${onlineClass} ${onlineClass =="avatar-online" ?"animate-pulse ": ""}  `}>
    <div className={`bg-gray-400 text-gray-800 rounded-full ${sizeClass} flex items-center justify-center`}>
        <span className="text-xl leading-none">
            {user.name.substring(0, 1)}
        </span>
    </div>

</div>
            )}
        </>
    );
};

export default UserAvatar;
