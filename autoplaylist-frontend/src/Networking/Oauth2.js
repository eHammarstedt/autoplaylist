import uuidv4 from 'uuid/v4'

export const getFrontendBaseUrl = () => {
    if (window.location.hostname === "localhost") {
        return "http://localhost:3000"
    }
    return "https://autoplaylists.richodemus.com"
};

export const getBackendBaseUrl = () => {
    if (window.location.hostname === "localhost") {
        return "http://192.168.0.12:8080"
    }
    return "https://api.autoplaylists.richodemus.com"
};

export const authenticate = () => {
    const clientId = "df0732a2defe44ecabd30868fa57a2d5";
    const scopes = "playlist-read-private playlist-modify-private playlist-modify-public";
    const redirectUri = getFrontendBaseUrl() + "/callback";
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
