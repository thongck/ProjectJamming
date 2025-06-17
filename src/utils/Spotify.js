let accessToken = "";
// const clientID = "e14fc9eb6fa3475cb0f78c69407c12b7";
// const redirectUrl = "http://127.0.0.1:3000";
// const redirectUrl = "";

// const Spotify stores function objects
const Spotify = {
    
    //For client credential, no personalised activities or features
    //are allowed.
    async getAccessToken(){   // getAccessToken Function Object creates the accessToken if not found

       const clientId = "a49c66b0887b44a6b562c5df422175b5"; // Replace with your Client ID
       const clientSecret = "f5adb905282d472485e5ee43edaa0328"; // Replace with your Client Secret   

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            }),
        });
    
        const data = await response.json();
        console.log(data.access_token)
        return data.access_token; // Returns the access token

    },
    async search(term){ // search Function Object takes in a term to search for

        if(term === null || term === undefined || term === "" )
            return;

        const accessToken = await Spotify.getAccessToken();
        
        //use client credential to get spotify data
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

        // Implicit grant (below) no longer applies for new Spotify apps (since 9th Apr 25)
        // As future reference to incorporate Authorization Code Grants instead
        // refer to article: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
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
