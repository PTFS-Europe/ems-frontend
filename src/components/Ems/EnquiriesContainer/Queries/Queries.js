import React from 'react';

import { useTranslation } from 'react-i18next';

import QuerySearch from './QuerySearch/QuerySearch';
import QueryList from './QueryList/QueryList';
import QueryBulk from './QueryBulk/QueryBulk';
import ActiveUser from './ActiveUser/ActiveUser';
import useActiveUser from '../../../../hooks/useActiveUser';

import styles from './Queries.module.scss';

const Queries = () => {
    const { t } = useTranslation();
    const [activeUser] = useActiveUser();
    return (
        <div className={styles.queries}>
            {activeUser.role_code === 'STAFF' && (
                <>
                    <div role="search" className={styles.adminSearch}>
                        <QuerySearch
                            placeholder={t('Search queries')}
                            showAdd={false}
                        />
                    </div>
                    <div className={styles.headerContainer}>
                        <div className={styles.header}>
                            <QueryBulk />
                        </div>
                    </div>
                </>
            )}
            {activeUser.role_code === 'CUSTOMER' && (
                <>
                    <div className={styles.activeUserContainer}>
                        <ActiveUser colour={'#707070'}></ActiveUser>
                        <div role="search" className={styles.querySearch}>
                            <QuerySearch
                                placeholder={t('Search or start new query')}
                                showAdd={true}
                            />
                        </div>
                    </div>
                    <div className={styles.yourQueries}>
                        {t('Your queries')}
                    </div>
                </>
            )}
            <QueryList />
        </div>
    );
};

export default Queries;
