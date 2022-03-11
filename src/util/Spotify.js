
// TODO: remove sensitive information
const clientID = 'cd9b190ddfef4b75913bdee52e91221a';
// const redirectURI = 'http://localhost:3000/';
// const redirectURI = 'http://jeremyspotify.surge.sh';
const redirectURI = 'https://jeremy-jammming.netlify.app';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check for access token and token expiration
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${ clientID }&response_type=token&scope=playlist-modify-public&redirect_uri=${ redirectURI }`;
    }
  },

  search(term) {
    this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${ term }`, {
      headers: { Authorization: `Bearer ${ accessToken }` }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse) {
        return [];
      } else {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        });
      }
    });
  },

  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return;
    }

    const accessToken = this.getAccessToken();
    let headers = { Authorization: `Bearer ${ accessToken }` };

    return fetch(`https://api.spotify.com/v1/me`, {
      headers: headers
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {

      let userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${ userID }/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name: playlistName })
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {

        const playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${ userID }/playlists/${ playlistID }/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ uris: trackURIs })
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          const playlistID = jsonResponse.id;
          return playlistID;
        });
      });
    }).catch(error => {
      console.log(error);
    });
  }

};

export default Spotify;