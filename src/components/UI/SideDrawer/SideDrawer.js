import React from 'react';
import PropTypes from 'prop-types';

import Backdrop from '../Backdrop/Backdrop';

import styles from './SideDrawer.module.scss';

const SideDrawer = ({ children }) => (
    <div className={styles.sideDrawerContainer}>
        <div className={styles.sideDrawer}>{children}</div>
        <Backdrop></Backdrop>
    </div>
);

SideDrawer.propTypes = {
    children: PropTypes.object.isRequired
};

export default SideDrawer;
