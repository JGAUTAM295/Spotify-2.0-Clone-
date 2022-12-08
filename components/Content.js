import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
];

function Content() {
    const { data: session } = useSession();
    const [color, setColor] = useState(null);
    const [playlistId, setPlaylistId] = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const spotifyApi = useSpotify();

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi
                .getPlaylist("29HkFTI4hrRdUrvkcUbGWz").
                then((data) => {
                    setPlaylist(data.body);
                })
                .catch((error) =>
                    console.log("Something went wrong!", error));
        }
    }, [spotifyApi, playlistId]);
    console.log(playlist);
    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white float-right"
                    onClick={signOut}>
                    {session?.user.image
                        ?
                        <img src={session?.user.image} className="w-10 h-10 rounded-full" alt="profileImage" />
                        :
                        <img src="https://cortexwork.com/deliveryportal/public/assets/images/avatar.png" className="w-10 h-10 rounded-full" alt="profileImage" />
                    }

                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt="" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>

            <div>
                <Songs />
            </div>

        </div>
    )
}

export default Content
