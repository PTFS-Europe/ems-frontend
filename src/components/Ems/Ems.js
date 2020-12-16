import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Login from '../Auth/Login';
import EnquiriesContainer from './EnquiriesContainer/EnquiriesContainer';
import WebSocketClient from '../../classes/WebSocketClient';
import Destination from '../../classes/Destination';

import styles from './Ems.module.scss';

const Ems = ({ hasAuth }) => {
    const dispatch = useDispatch();

    const dest = new Destination();

    // Initialise the websocket connection
    // We pass dispatch to enable the WebSocketClient
    // class to dispatch actions
    WebSocketClient.connect(dispatch);

    // Paths on which we need to ignore a set destination
    const destIgnore = ['login'];
    const path = window.location.pathname;
    const ignoreDestination = destIgnore.find((entry) =>
        path.includes(entry)
    );
    const currentDestination = dest.getDestination();
    if (currentDestination && !ignoreDestination) {
        dest.clearDestination();
    }

    return hasAuth ? (
        <div className={styles.emsContainer}>
            <BrowserRouter>
                {
                    currentDestination &&
                    !ignoreDestination &&
                    <Redirect to={currentDestination}></Redirect>
                }
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
