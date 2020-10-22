import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { updateQueryBulk } from '../../../store/queries/queriesActions';
import styles from './QueryActionButton.module.scss';

const QueryActionButton = ({ query }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const stateFolders = useSelector((state) => state.folders);
    const stateUnseen = useSelector((state) => state.unseen.unseenCounts);

    const [currentState, setCurrentState] = useState({
        class: ['actionButton'],
        icon: 'ellipsis-h',
        alt: t('Change query folder')
    });

    // Derive the display state of this query's action button
    const deriveNewState = () => {
        // If this query has unread message, that takes precedent
        if (
            Object.prototype.hasOwnProperty.call(stateUnseen, query.id) &&
            stateUnseen[query.id] > 0
        ) {
            return {
                class: [styles.actionButton, styles.unseenCount],
                alt: t('Query has unread messages', {
                    unread: stateUnseen[query.id]
                })
            };
        }
        return {
            icon: query.folder ? t(`folderIcon_${query.folder}`) : 'ellipsis-h',
            class: query.folder
                ? [styles.actionButton, styles[`folder_${query.folder}`]]
                : [styles.actionButton, styles.folder_NONE],
            alt: query.folder
                ? t(`folderName_${query.folder}`)
                : t('Change query folder')
        };
    };

    // When the query folder changes, update our state
    useEffect(() => {
        const newState = deriveNewState();
        setCurrentState(newState);
        // Disable liniting below, once again we are being prompted
        // to add dependencies that don't make sense
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.folder, stateUnseen]);

    return (
        <div className={styles.container} role="group">
            {currentState.icon && (
                <button
                    aria-label={currentState.alt}
                    className={currentState.class.join(' ')}>
                    <FontAwesomeIcon
                        alt={currentState.alt}
                        icon={currentState.icon}
                    />
                </button>
            )}
            {!currentState.icon && (
                <button
                    aria-label={currentState.alt}
                    alt={currentState.alt}
                    className={currentState.class.join(' ')}
                >
                    <span className={styles.unseenNumber}>
                        {stateUnseen[query.id]}
                    </span>
                </button>
            )}
            {stateFolders &&
                stateFolders.folderList
                    .filter((f) => f.code !== query.folder)
                    .map((folder) => (
                        <button
                            aria-label={folder.name}
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
            {query.folder && (
                <button
                    aria-label={t('Remove from folder')}
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
        </div>
    );
};

QueryActionButton.propTypes = {
    query: PropTypes.object.isRequired
};

export default QueryActionButton;
