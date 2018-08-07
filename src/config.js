const PORT = 8081;
export const BACKEND_HOST = "http://" + window.location.hostname + ":" + PORT + "/";

export function geturl(endpoint) {
    return BACKEND_HOST + endpoint
}
