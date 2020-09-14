import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setFoldersFilter } from '../../../../../../store/folders/foldersActions';

import styles from './CalculatedFolders.module.scss';

const CalculatedFolders = ({ stateFolders }) => {
    const { t } = useTranslation();

    // Enable us to dispatch
    const dispatch = useDispatch();

    // Make the state we need available
    const stateFoldersCounts = useSelector(
        (state) => state.folders.foldersCounts
    );

    // Set the active filter
    const setFilter = (code) => {
        dispatch(setFoldersFilter(code));
    };

    // Is a given folder the active filter?
    const isSelected = (code) => {
        return code === stateFolders.filter ? styles.selected : '';
    };

    return (
        <React.Fragment>
            <li className={`${styles.folder} ${isSelected('UNREAD')}`}>
                <div data-testid="folderIcon" className={styles.iconUnread}>
                    <FontAwesomeIcon
                        alt={t('Unread')}
                        icon={t('folderIcon_UNREAD')}
                    />
                </div>
                <button
                    onClick={() => setFilter('UNREAD')}
                    className={styles.folderName}
                >
                    {t('Unread')}
                </button>
                <span className={styles.folderCount}>
                    {stateFoldersCounts.UNREAD}
                </span>
            </li>
            <li className={`${styles.folder} ${isSelected('ALL_QUERIES')}`}>
                <div data-testid="folderIcon" className={styles.iconAllQueries}>
                    <FontAwesomeIcon
                        alt={t('All queries')}
                        icon={t('folderIcon_ALL_QUERIES')}
                    />
                </div>
                <button
                    onClick={() => setFilter('ALL_QUERIES')}
                    className={styles.folderName}
                >
                    {t('All queries')}
                </button>
                <span className={styles.folderCount}>
                    {stateFoldersCounts.ALL_QUERIES}
                </span>
            </li>
        </React.Fragment>
    );
};

export default CalculatedFolders;
