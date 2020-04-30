import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import EnquiriesContainer from './EnquiriesContainer/EnquiriesContainer';

import styles from './Ems.module.css';

const Ems = (props) => {
    return (
        <BrowserRouter>
            <div className={styles.emsContainer}>
                <EnquiriesContainer></EnquiriesContainer>
            </div>
        </BrowserRouter>
    );
};

export default Ems;
