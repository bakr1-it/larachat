
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";

const CustomAudioPlayer = ({ file, showVolume = true }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if(isPlaying){
            audio.pause();

        }else{
            setDuration(audio.duration);
            audio.play();

        }
        setIsPlaying(!isPlaying);

    };
    const handelChangeVolumn =(e)=>{
        const volume = e.target.value;
        audioRef.current.volume = volume;
        setVolume(volume);

    }
    const handelUpdateTime = (e)=>{
        const audio= audioRef.current;
        setDuration(audio.duration);
        setCurrentTime(e.target.currentTime);


    }

const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
};

const handleSeekChange = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
};
    return (
<div className="flex w-full items-center py-2 px-3 gap-2 rounded-md bg-slate-800">
    <audio
    src={file.url}
    controls
    onLoadedMetadata={handleLoadedMetadata}
    onTimeUpdate={handelUpdateTime}
    className="hidden"


    ></audio>
    <button className="text-gray-400 " onClick={togglePlayPause}>
        {isPlaying && <PauseCircleIcon className="w-6 h-6" />}
        {!isPlaying && <PlayCircleIcon className="w-6 h-6" />}
    </button>
    {showVolume && (
        <input type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handelChangeVolumn}


        />
    ) }
    <input type="range"
    className="flex-1"
    min="0"
    max={duration}
    value={currentTime}
    onChange={handleSeekChange}
    />

</div>
    );
};

export default CustomAudioPlayer;
