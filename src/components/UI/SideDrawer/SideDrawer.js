import React from 'react';

import Backdrop from '../Backdrop/Backdrop';

import styles from './SideDrawer.module.css';

const SideDrawer = ({ children }) => (
    <div className={styles.sideDrawerContainer}>
        <div className={styles.sideDrawer}>{children}</div>
        <Backdrop></Backdrop>
    </div>
);

export default SideDrawer;
