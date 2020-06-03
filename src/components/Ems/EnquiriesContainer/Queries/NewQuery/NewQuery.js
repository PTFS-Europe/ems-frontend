import React from 'react';

import StartNewQuery from '../../../../UI/StartNewQuery/StartNewQuery';

import styles from './NewQuery.module.scss';

const NewQuery = () => {
    return (
        <section className={styles.newQuery}>
            <StartNewQuery />
        </section>
    );
};

export default NewQuery;
