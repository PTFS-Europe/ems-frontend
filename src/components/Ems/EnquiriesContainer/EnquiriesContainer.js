import React from 'react';

import styles from './EnquiriesContainer.module.css';

import Queries from './Queries/Queries';
import ActiveQuery from './Queries/ActiveQuery/ActiveQuery';
import SideDrawer from '../../UI/SideDrawer/SideDrawer';

const EnquiriesContainer = (props) => {
    return (
        <div className={styles.queriesContainer}>
            <Queries></Queries>
            <ActiveQuery></ActiveQuery>
            <SideDrawer></SideDrawer>
        </div>
    );
};

export default EnquiriesContainer;
