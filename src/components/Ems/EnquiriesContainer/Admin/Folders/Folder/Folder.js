import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setFoldersFilter } from '../../../../../../store/folders/foldersActions';

import styles from './Folder.module.scss';

const Folder = ({ folder, stateFolders }) => {
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
                    icon={t(`folderIcon_${folder.code}_CIRCLE`)}
                />
            </div>
            <button
                aria-label={t(`folderName_${folder.code}`)}
                onClick={() => setFilter(folder.code)}
                className={styles.folderName}
            >
                {t(`folderName_${folder.code}`)}
            </button>
            <span className={styles.folderCount}>
                {stateFoldersCounts[folder.id]}
            </span>
        </li>
    );
};

Folder.propTypes = {
    folder: PropTypes.object.isRequired,
    stateFolders: PropTypes.object.isRequired
};

export default Folder;
