import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED TOKEN IS ", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.accessToken,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }
    }
    catch (error) {
        console.log(error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

export const authOptions = {
    // Configure one or more authentication providers  
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIECT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIECT_SECRET,
            authorization: LOGIN_URL,
        }),
        // ...add more providers here
    ],

    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, account, user }) {
            //initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                };
            }

            // Refresh Token
            // Return previous token if the access token has not expired yet
            // if (token && token.accessTokenExpires > Date.now()) {
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Access token has exired. so we nedd to refresh Token
            console.log("Access token has exired. refreshing...");

            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session;
        },
    }
}

export default NextAuth(authOptions);