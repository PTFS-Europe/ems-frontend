import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './CalculatedFolders.module.scss';

const CalculatedFolders = () => {
    const { t } = useTranslation();

    // Make the state we need available
    const stateQueries = useSelector((state) => state.queries);

    // This function is a placeholder until we get message unread status
    // in place
    const getAllQueriesCount = () => {
        return stateQueries.queryList.length;
    };

    // This function is a placeholder until we get message unread status
    // in place
    const getUnreadQueriesCount = () => 0;

    return (
        <React.Fragment>
            <li className={styles.folder}>
                <div data-testid="folderIcon" className={styles.iconUnread}>
                    <FontAwesomeIcon
                        alt={t('Unread')}
                        icon={t('folderIcon_UNREAD')}
                    />
                </div>
                <button className={styles.folderName}>{t('Unread')}</button>
                <span className={styles.folderCount}>
                    {getUnreadQueriesCount()}
                </span>
            </li>
            <li className={styles.folder}>
                <div data-testid="folderIcon" className={styles.iconAllQueries}>
                    <FontAwesomeIcon
                        alt={t('All queries')}
                        icon={t('folderIcon_ALL_QUERIES')}
                    />
                </div>
                <button className={styles.folderName}>
                    {t('All queries')}
                </button>
                <span className={styles.folderCount}>
                    {getAllQueriesCount()}
                </span>
            </li>
        </React.Fragment>
    );
};

export default CalculatedFolders;
