import React from 'react';

import { BrowserRouter, Route } from 'react-router-dom';

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
            </BrowserRouter>
        </div>
    );
};

export default Ems;
