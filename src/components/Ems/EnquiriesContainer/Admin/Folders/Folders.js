import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Folder from './Folder/Folder';
import CalculatedFolders from './CalculatedFolders/CalculatedFolders';

import { fetchFolders } from '../../../../../store/folders/foldersActions';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';

import styles from './Folders.module.scss';

const Folders = () => {
    const { t } = useTranslation();

    // Enable us to dispatch
    const dispatch = useDispatch();

    // Make the state we need available
    const stateFolders = useSelector((state) => state.folders);

    // When we're mounted, fetch the folders
    useEffect(() => {
        // Only do this if we don't already have folders
        if (!stateFolders || stateFolders.folderList.length === 0) {
            dispatch(fetchFolders());
        }
        // Disable linting here, we do not want stateFolders.folderList.length
        // to be a dependency, this hook should only fire when we first mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <aside className={styles.container}>
            <h1 className={styles.heading}>{t('Folders')}</h1>
            <ul className={styles.folderList}>
                <CalculatedFolders />
            </ul>
            {stateFolders && stateFolders.loading && (
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            )}
            {stateFolders && !stateFolders.loading && (
                <ul className={styles.folderList}>
                    {stateFolders &&
                        stateFolders.folderList
                            .sort(({ position: b }, { position: a }) => b - a)
                            .map((folder) => (
                                <Folder
                                    key={folder.id}
                                    stateFolders={stateFolders}
                                    folder={folder}
                                />
                            ))}
                </ul>
            )}
        </aside>
    );
};

export default Folders;
