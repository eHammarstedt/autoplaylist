import uuidv4 from 'uuid/v4'

const authenticate = () => {
    const clientId = "df0732a2defe44ecabd30868fa57a2d5";
    const scopes = "playlist-read-private";
    const redirectUri = "http://localhost:3000/callback";
    // todo save and verify state
    const uuid = uuidv4();
    window.location.replace(
        "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" + clientId +
        "&scope=" + scopes +
        "&redirect_uri=" + redirectUri +
        "&state=" + uuid +
        "&show_dialog=false"
    );
};

export default authenticate
