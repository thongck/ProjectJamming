let accessToken = "your-access-token";
const clientID = "your-client-id";
const redirectUrl = "http://localhost:your-port-number";
// const redirectUrl = "";

// const Spotify stores function objects
const Spotify = {
    
    getAccessToken(){   // getAccessToken Function Object creates the accessToken if not found

        // First check for access token
        if(accessToken) return accessToken;

        const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

        // Second check for the access token
        if(tokenInURL && expiryTime){
            // set access token and expiry time variables
            accessToken = tokenInURL[1];
            const expiresIn = Number(expiryTime[1]);
            
            // log the values for the accessToke and its expiry
            console.log(accessToken, expiresIn);

            // Set the access token to expire at the value for expiration time
            // clear accessToken after expiry time
            // If expires_in = 3600 (1 hour), accessToken'll be cleared after 1 hour (3600 * 1000 ms = 3,600,000 ms or 1 hour).
            window.setTimeout(()=>(accessToken=""), expiresIn * 1000);

            // Clear the url after the access token expires
            window.history.pushState("Access token", null, "/");

            return accessToken;
        }else{
            // If I don't have access to spotify, request for it
            const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;

            window.location = redirect;
        }

    },
    async search(term){ // search Function Object takes in a term to search for

        if(term === null || term === undefined || term === "" )
            return;

        accessToken = Spotify.getAccessToken();
        return await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then((response)=> response.json())
        .then((jsonResponse)=>{
            if(!jsonResponse)
                console.log("Response error");  // Response returned from spotify is erroneous

            return jsonResponse.tracks.items.map((t) => ({
                id: t.id,
                name: t.name,
                artist: t.artists[0].name,
                album: t.album.name,
                uri: t.uri
            }));
        })
    },
    savePlayList(name, tracksUris){     // savePlayList takes in the name and the Uri of the track to save

        if(!name || !tracksUris)
            return;

        const token = Spotify.getAccessToken();                                                             // Spotify.getAccessToken() remembers me, based on my ClientID
        const header = {Authorization: `Bearer ${token}`};
        let userId = "";

        return fetch(`https://api.spotify.com/v1/me`, {headers: header})                                     // fetch my profile
                .then((response) => response.json())
                .then((jsonResponse)=>{
                    userId = jsonResponse.id;                                                               // process the response of my own ID
                    let playlistId = "";
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {                  // fetch playlist of my profile and store the name of my new playlist
                        headers: header, 
                        method: "post", 
                        body: JSON.stringify({name: name})})
                            .then((response)=> response.json())
                            .then((jsonResponse)=>{
                                playlistId = jsonResponse.id;
                                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { // fetch new playlist of my profile and store the songs
                                    headers: header,
                                    method: "POST",
                                    body: JSON.stringify({uris: tracksUris})
                                })
                            })
                });
    }
};
        
export {Spotify};












/**
 * #
 * access_token = BQDC1Nss_0bk6329NEXHUX0_SBDia2Np34OUjVVVYrXMMrY0jngmF7C_MpTWVqCw266QowK4Snyen-yxTRaZLF2gLwDO8OKkEqQtGJK7aK_Cja8sqfz0ZGGvwFOimIy1Jk7zIfB2Mxz-_L0psjGOKVk7kYGUmdtgP9gr2ZSZ1OB6nclR5FyOJ0x8zQON75FmDhEG_VdfQHlLHlbI
 * &
 * token_type = Bearer
 * &
 * expires_in=3600
 */