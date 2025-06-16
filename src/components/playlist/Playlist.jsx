import React from 'react'
import './Playlist.css';
import Tracklist from '../tracklist/Tracklist.jsx'

function Playlist() {

  return (

    <div className="Playlist">
      <input type="text" />
      {/* <!-- Add a TrackList component --> */}
      <button className="Playlist-save">SAVE TO SPOTIFY</button>
    </div>
  )
}

export default Playlist
