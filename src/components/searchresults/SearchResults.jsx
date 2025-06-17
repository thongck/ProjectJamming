import React from 'react';
import Tracklist from '../tracklist/Tracklist';
import './SearchResults.css';

function SearchResults({searchResults, addTrack}) {
  return (
      <div className="SearchResults">
        <h2>Result</h2>
          {/* display a tracklist */}
          {/* Display tracks */}
          <Tracklist
            listResults={searchResults}
            addTrack={addTrack}
            remove={false}
          />
          

      </div>
  )
}

export default SearchResults