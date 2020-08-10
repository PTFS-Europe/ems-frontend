import React from 'react';

import { BrowserRouter, Route } from 'react-router-dom';

import Login from '../Auth/Login';
import EnquiriesContainer from './EnquiriesContainer/EnquiriesContainer';

import styles from './Ems.module.scss';

const Ems = () => {
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
