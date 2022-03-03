import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{ id: 1, title: 'Title', artist: 'Artist', album: 'Album', uri: 'uri1' }, { id: 2, title: 'Title2', artist: 'Artist2', album: 'Album2', uri: 'uri2'  }, { id: 3, title: 'Title3', artist: 'Artist3', album: 'Album3', uri: 'uri3'  }],
      playlistName: 'Jeremy\'s Playlist',
      playlistTracks: [{ id: 1, title: 'Title', artist: 'Artist', album: 'Album', uri: 'uri1'  }],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      let newTrackList = this.state.playlistTracks.slice();
      newTrackList.push(track);
      this.setState({ playlistTracks: newTrackList });
    }
  }

  removeTrack(track) {
    const newTrackList = this.state.playlistTracks.slice().filter(oldTrack => track.id !== oldTrack.id);
    this.setState({ playlistTracks: newTrackList });
  }

  updatePlaylistName(name) { this.setState({ playlistName: name }); }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri)
    console.log(trackURIs);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
