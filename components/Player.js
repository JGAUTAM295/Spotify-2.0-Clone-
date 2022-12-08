import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import {
    ArrowsRightLeftIcon,
    ForwardIcon,
    PauseIcon,
    PlayIcon,
    ArrowUturnLeftIcon,
    BackwardIcon,
    SpeakerWaveIcon,
    HeartIcon,
} from '@heroicons/react/24/solid';

import { SpeakerWaveIcon as SpeakerXMarkIcon } from '@heroicons/react/24/outline';

function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                console.log("Now Playing: ", data.body?.item);
                setCurrentIdTrack(data.body?.item?.id);
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            });
        }
    };

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            }
            else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            //fetch the song info
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session]);

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedjustVolume(volume);
        }
    }, [volume]);

    const debouncedjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((error) => console.log(error));
        }, 500), []
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-500 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images?.[0]?.url} alt={songInfo?.name} />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            {/* Center */}
            <div className="flex items-center justify-evenly">
                <ArrowsRightLeftIcon className="button hover: scale-125" />
                <BackwardIcon className="button hover: scale-125" />
                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10 hover: scale-125" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10 hover: scale-125" />
                )}
                <ForwardIcon
                    // onClick={()=> spotifyApi.skipToNext()}  --The APi is not working
                    className="button hover: scale-125" />
                <ArrowUturnLeftIcon className="button hover: scale-125" />
            </div>
            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <SpeakerXMarkIcon onCLick={() => volume > 0 && setVolume(volume - 10)} className="button hover:scale-125" />
                <input className="w-14 md:w-28" type="range" value={volume} onChange={e => setVolume(Number(e.target.value))} min={0} max={100} />
                <SpeakerWaveIcon onCLick={() => volume < 100 && setVolume(volume + 10)} className="button hover:scale-125" />
            </div>
        </div >
    )
}

export default Player;
