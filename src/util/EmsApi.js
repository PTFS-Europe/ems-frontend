import axios from 'axios';
import jwt from 'jsonwebtoken';

class EmsApi {
    constructor() {
        this._token = null;
        // How much before our token expires should we attempt
        // to refresh it (in seconds)
        this._premptiveRefresh = 180;
        this._refreshTimer = null;
        this._client = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            withCredentials: true
        });
    }
    makeRequest(path, options = {}) {
        return this._client.request({
            ...options,
            url: path
        });
    }
    set token(newToken) {
        this._token = newToken;
    }
    get token() {
        return this._token;
    }
    removeToken() {
        this._token = null;
        clearTimeout(this._refreshTimer);
    }
    startTimer() {
        // If we've got a running timer
        if (this._refreshTimer) {
            // ..cancel it
            clearTimeout(this._refreshTimer);
        }
        // Set a timer to refresh the token a defined number of
        // seconds (_premptiveRefresh) before it is due to expire
        const decoded = jwt.decode(this._token, {
            json: true
        });
        // Calculate how long we want to set the timer for
        const now = parseInt(Date.now() / 1000);
        const exp = decoded.exp;
        const shouldRefreshAt = exp - this._premptiveRefresh;
        const shouldRefreshIn = shouldRefreshAt - now;
        // Start a new one
        this._refreshTimer = setTimeout(
            () => this.makeRequest('/token'),
            shouldRefreshIn * 1000
        );
    }
    requestInterceptor() {
        this._client.interceptors.request.use((config) => {
            if (this._token) {
                Object.assign(config.headers, {
                    Authorization: `Bearer ${this._token}`
                });
            }
            return config;
        });
    }
    responseInterceptor() {
        this._client.interceptors.response.use(
            // Intercept a success response
            (response) => {
                // If we've received a JWT, update our cache
                if (response.headers && response.headers.authorization) {
                    const responseToken = response.headers.authorization.replace(
                        'Bearer ',
                        ''
                    );
                    if (this._token !== responseToken) {
                        // Update our cache if necessary
                        this.token = responseToken;
                        // Start a timer to keep the token fresh
                        this.startTimer();
                    }
                }
                return response;
            },
            // Intercept a fail response
            (err) => {
                // We've received a 401 - redirect the useragent
                // to the login page
                if (err.response.status === 401) {
                    window.location.replace('/login');
                }
            }
        );
    }
}

const singleton = new EmsApi();

export default singleton;
