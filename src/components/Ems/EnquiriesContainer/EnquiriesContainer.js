import React from 'react';

import styles from './EnquiriesContainer.module.scss';

import Admin from './Admin/Admin';
import Queries from './Queries/Queries';
import ActiveQuery from './Queries/ActiveQuery/ActiveQuery';

const EnquiriesContainer = (props) => {
    return (
        <div className={styles.queriesContainer}>
            <Admin>
                <Queries></Queries>
                <ActiveQuery></ActiveQuery>
            </Admin>
        </div>
    );
};

export default EnquiriesContainer;
