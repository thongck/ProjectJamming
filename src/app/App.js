import './App.css';
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/searchbar/SearchBar.jsx';
import SearchResults from '../components/searchresults/SearchResults.jsx';
import Playlist from '../components/playlist/Playlist.jsx';
import { Spotify } from '../utils/Spotify.js';

function App() {

  // state management (useState() hook) - to create an Array called searchResults
  const [searchResults, setSearchResults] = useState([]);
  const [playListTracks, setPlayListTracks] = useState([]);
  const [playListName, setPlayListName] = useState("New PlayList");
  const [searchTerm, setSearchTerm] = useState("");

  // sideEffect (Document Load) - called useEffect hook
  // The blank bracket refers to running this hook only once
  useEffect(() => {
    //Spotify.getAccessToken();

    // populate searchResults with defaultValues
    setSearchResults([
      {
        id: 1,
        name: "Track 1",
        artist: "Track 1 Artist",
        album: "Track 1 Album",
        uri: "Track 1 Uri"
      },
      {
        id: 2,
        name: "Track 2",
        artist: "Track 2 Artist",
        album: "Track 2 Album",
        uri: "Track 2 Uri"
      },
      {
        id: 3,
        name: "Track 3",
        artist: "Track 3 Artist",
        album: "Track 3 Album",
        uri: "Track 3 Uri"
      },
      {
        id: 4,
        name: "Playlist 1",
        artist: "Playlist 1 Artist",
        album: "Playlist 1 Album",
        uri: "Playlist 1 Uri"
      },
      {
        id: 5,
        name: "Playlist 2",
        artist: "Playlist 2 Artist",
        album: "Playlist 2 Album",
        uri: "Playlist 2 Uri"
      },
    ]);
    
    setPlayListTracks([
      
    ]);

  },[]); 
  
  // passed as a prop to SearchBar 
  // invokes the Spotify.search() 
  function search(term = ""){
    setSearchTerm(term);
    //console.log(term);
    
  }
  
  async function runSearch(){
    const results = await Spotify.search(searchTerm);
    setSearchResults(results);
  }

  // passed as a prop to SearchResults 
  function addTrack(track){
    
    const findTrack = playListTracks.find((currenttrack) => currenttrack.id === track.id);
    
    //alert(track.id);
    if(!findTrack) {
      console.log("Add track", track.id);
      setPlayListTracks([...playListTracks, track]);
    }

    setSearchResults(
    searchResults.filter(currenttrack => currenttrack.id != track.id));
    
  }

  // passed as a prop Playlist
  function removeTrack(track){
    const findTrack = playListTracks.find((currenttrack) => currenttrack.id === track.id);
    
    //alert(track.id);
    if(findTrack) {
      setPlayListTracks(playListTracks.filter(currenttrack => currenttrack.id != track.id));
      console.log("Remove track", track.id);
    }

    setSearchResults([...searchResults, findTrack]);
    
  }

  // passed as a prop to PlayList (update playListName)
  function updatePlayListName(strName){
    setPlayListName(strName);
    
  }

  // passed as a prop to PlayList (to save the new playlist)
  function savePlayList(){
    //TO explore Spotify.savePlayList()
    //convert to using Authorization code grant

    const savedPlayListName = playListName;
    const savedPlayListTracks = playListTracks.length;

    alert(`${savedPlayListName} is saved with ${savedPlayListTracks} tracks.`);

    setPlayListName("New Playlist");
    setPlayListTracks([]);
    setSearchTerm("");
  }

  //console.log(searchTerm);
  console.log(playListTracks);
  console.log(playListName);

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        {/* <!-- Add a SearchBar component --> */}
        <SearchBar
          onSearch={search}
          runSearch={runSearch}
          searchTerm={searchTerm}
        />
        <div className="App-playlist">
          {/* <!-- Add a SearchResults component --> */}
          <SearchResults
            searchResults={searchResults}
            addTrack = {addTrack}
          />

          <Playlist
            playListTracks={playListTracks}
            removeTrack={removeTrack}
            playListName={playListName}
            updatePlayListName={updatePlayListName}
            savePlayList = {savePlayList}
          />
          {/* <!-- Add a Playlist component --> */}
        </div>
      </div>
    </div>
  );
}

export default App;
