import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-email",
    "streaming",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    // "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read",
].join(",");

const params = {
    scope: scopes,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + queryParamString.toString();

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIECT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIECT_SECRET
    // redirectUri: 'http://www.example.com/callback'
});

export default spotifyApi;

export { LOGIN_URL };