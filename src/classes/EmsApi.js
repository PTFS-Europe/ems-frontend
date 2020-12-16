import axios from 'axios';
import jwt from 'jsonwebtoken';
import isEqual from 'lodash.isequal';

import Destination from '../classes/Destination';

class EmsApi {
    constructor() {
        this._token = null;
        // How much before our token expires should we attempt
        // to refresh it (in seconds)
        this._premptiveRefresh = 180;
        this._refreshTimer = null;
        const baseURL = process.env.NODE_ENV === 'production' ?
            '/api/v1.0' :
            process.env.REACT_APP_API_URL;
        this._client = axios.create({
            baseURL,
            withCredentials: true
        });
        this._inProgress = [];
    }
    requester(payload) {
        return this._client.request(payload).then((res) => {
            // Remove this request from our in progress
            // list
            const index = this.findRequest(payload);
            this._inProgress.splice(index, 1);
            return res;
        });
    }
    makeRequest(path, options = {}) {
        const payload = {
            ...options,
            url: path
        };
        if (!this.isInProgress(payload)) {
            this._inProgress.push(payload);
            return this.requester(payload);
        } else {
            return Promise.resolve();
        }
    }
    findRequest(request) {
        return this._inProgress.findIndex((req) => isEqual(request, req));
    }
    isInProgress(request) {
        const index = this.findRequest(request);
        return index !== -1 ? true : false;
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
                    const responseToken = response.headers
                        .authorization.replace(
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
                    // The user was trying to go somewhere, store that
                    // destination so they can be taken to it after
                    // authentication
                    const dest = new Destination();
                    dest.setDestination(window.location.pathname);
                    window.location.replace('/login');
                }
            }
        );
    }
}

const singleton = new EmsApi();

export default singleton;
