import React from 'react';
import { useDispatch } from 'react-redux';

import { BrowserRouter, Route } from 'react-router-dom';

import Login from '../Auth/Login';
import EnquiriesContainer from './EnquiriesContainer/EnquiriesContainer';
import WebSocketClient from '../../classes/WebSocketClient';

import styles from './Ems.module.scss';

const Ems = () => {
    const dispatch = useDispatch();

    // Initialise the websocket connection
    // We pass dispatch to enable the WebSocketClient
    // class to dispatch actions
    WebSocketClient.connect(dispatch);

    return (
        <div className={styles.emsContainer}>
            <BrowserRouter>
                <Route exact path="/" component={EnquiriesContainer} />
                <Route
                    exact
                    path="/query/:queryId"
                    component={EnquiriesContainer}
                />
                <Route exact path="/login" component={Login} />
            </BrowserRouter>
        </div>
    );
};

export default Ems;
