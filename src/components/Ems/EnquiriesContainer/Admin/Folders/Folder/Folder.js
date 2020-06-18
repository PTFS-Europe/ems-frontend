import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setFoldersFilter } from '../../../../../../store/folders/foldersActions';

import styles from './Folder.module.scss';

const Folder = ({ folder, stateFolders }) => {
    const { t } = useTranslation();

    // Enable us to dispatch
    const dispatch = useDispatch();

    // Set the active filter
    const setFilter = (code) => {
        dispatch(setFoldersFilter(code));
    };

    // Is a given folder the active filter?
    const isSelected = (code) => {
        return code === stateFolders.filter ? styles.selected : '';
    };

    return (
        <li
            key={folder.id}
            className={`${styles.folder} ${isSelected(folder.code)}`}
        >
            <div
                data-testid="folderIcon"
                className={styles[`icon_${folder.code}`]}
            >
                <FontAwesomeIcon
                    alt={t(`folderName_${folder.code}`)}
                    icon={t(`folderIcon_${folder.code}`)}
                />
            </div>
            <button
                onClick={() => setFilter(folder.code)}
                className={styles.folderName}
            >
                {t(`folderName_${folder.code}`)}
            </button>
            <span className={styles.folderCount}>{folder.count}</span>
        </li>
    );
};

export default Folder;
