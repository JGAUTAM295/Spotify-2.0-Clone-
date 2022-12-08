import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIECT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIECT_SECRET,
});

function useSpotify() {
    const { data: session, status } = useSession();

    useEffect(() => {

        if (session) {
            //If refresh access token attempts fails, direct user to logi...
            if (session.error === 'RefreshAccessTokenError') {
                signIn();
            }

            spotifyApi.setAccessToken(session.user.accessToken);
        }
    }, [session]);

    return spotifyApi;
}

export default useSpotify;
