import React from 'react';

import styles from './Popover.module.scss';

const Popover = ({ children, instanceStyles = '' }) => {
    return (
        <div role="dialog" className={`${styles.container} ${instanceStyles}`}>
            <div className={styles.contentContainer}>{children}</div>
            <div data-testid="pointer" className={styles.pointer}></div>
        </div>
    );
};

export default Popover;
