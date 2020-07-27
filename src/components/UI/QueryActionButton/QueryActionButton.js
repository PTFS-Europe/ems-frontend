import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { updateQueryBulk } from '../../../store/queries/queriesActions';
import styles from './QueryActionButton.module.scss';

const QueryActionButton = ({ query }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const stateFolders = useSelector((state) => state.folders);

    const [currentState, setCurrentState] = useState({
        class: ['actionButton'],
        icon: 'ellipsis-h',
        alt: t('Change query folder')
    });

    // When the query folder changes, update our state
    useEffect(() => {
        setCurrentState({
            icon: query.folder ? t(`folderIcon_${query.folder}`) : 'ellipsis-h',
            class: query.folder
                ? [styles.actionButton, styles[`folder_${query.folder}`]]
                : [styles.actionButton, styles.folder_NONE],
            alt: query.folder
                ? t(`folderName_${query.folder}`)
                : t('Change query folder')
        });
        // Disable liniting below, once again we are being prompted
        // to add dependencies that don't make sense
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.folder]);

    return (
        <div className={styles.container} role="group">
            <button className={currentState.class.join(' ')}>
                <FontAwesomeIcon
                    alt={currentState.alt}
                    icon={currentState.icon}
                />
            </button>
            {query.folder && (
                <button
                    onClick={() =>
                        dispatch(
                            updateQueryBulk([
                                {
                                    id: query.id,
                                    folder: null
                                }
                            ])
                        )
                    }
                    className={`${styles.actionButton} ${styles.remove}`}
                >
                    <FontAwesomeIcon
                        alt={t('Remove from folder')}
                        icon={'times'}
                    />
                </button>
            )}
            {stateFolders &&
                stateFolders.folderList
                    .filter((f) => f.code !== query.folder)
                    .map((folder) => (
                        <button
                            onClick={() =>
                                dispatch(
                                    updateQueryBulk([
                                        {
                                            id: query.id,
                                            folder: folder.code
                                        }
                                    ])
                                )
                            }
                            key={folder.id}
                            className={`${styles.actionButton} ${
                                styles[folder.code]
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={t(`folderIcon_${folder.code}`)}
                            />
                        </button>
                    ))}
        </div>
    );
};

export default QueryActionButton;
