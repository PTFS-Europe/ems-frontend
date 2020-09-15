import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { BrowserRouter, Route } from 'react-router-dom';

import Login from '../Auth/Login';
import EnquiriesContainer from './EnquiriesContainer/EnquiriesContainer';
import WebSocketClient from '../../classes/WebSocketClient';

import styles from './Ems.module.scss';

const Ems = ({ hasAuth }) => {
    const dispatch = useDispatch();

    // Initialise the websocket connection
    // We pass dispatch to enable the WebSocketClient
    // class to dispatch actions
    WebSocketClient.connect(dispatch);

    return hasAuth ? (
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
    ) : (
        <div className={styles.emsContainer}>
            <BrowserRouter>
                <Route exact path="/login" component={Login} />
            </BrowserRouter>
        </div>
    );
};

Ems.propTypes = {
    hasAuth: PropTypes.bool.isRequired
};

export default Ems;
