import React from 'react';

import { useTranslation } from 'react-i18next';

import ActiveUser from './ActiveUser/ActiveUser';
import QuerySearch from './QuerySearch/QuerySearch';
import QueryList from './QueryList/QueryList';

import styles from './Queries.module.scss';

const Queries = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.queries}>
            <QueryList />
        </div>
    );
    /*
    return (
        <div className={styles.queries}>
            <div className={styles.activeUserContainer}>
                <ActiveUser colour={'#707070'}></ActiveUser>
            </div>
            <div role="search" className={styles.querySearch}>
                <QuerySearch
                    placeholder={t('Search or start new query')}
                    showAdd={true}
                ></QuerySearch>
            </div>
            <QueryList></QueryList>
        </div>
    );
    */
};

export default Queries;
