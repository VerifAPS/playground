const PORT = 3000;
export const BACKEND_HOST = "http://" + window.location.hostname + ":" + PORT + "/";

export function geturl(endpoint) {
    return BACKEND_HOST + endpoint
}