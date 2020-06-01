import React from 'react';

import styles from './EnquiriesContainer.module.scss';

import Queries from './Queries/Queries';
import ActiveQuery from './Queries/ActiveQuery/ActiveQuery';

const EnquiriesContainer = (props) => {
    return (
        <div className={styles.queriesContainer}>
            <Queries></Queries>
            <ActiveQuery></ActiveQuery>
        </div>
    );
};

export default EnquiriesContainer;
