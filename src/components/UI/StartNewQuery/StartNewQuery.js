import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

import { createQuery } from '../../../store/queries/queriesActions';

import styles from './StartNewQuery.module.scss';

const StartNewQuery = () => {
    const [clicked, setClicked] = useState(false);
    const [title, setTitle] = useState('');

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const history = useHistory();

    const startCreate = () => {
        if (title.length > 0) {
            dispatch(
                createQuery({
                    query: title
                })
            ).then((response) => {
                history.push(`/query/${response.payload.data.id}`);
            });
        }
    };

    return (
        <div className={styles.container}>
            {!clicked && (
                <button
                    onClick={() => setClicked(true)}
                    className={styles.startButton}
                >
                    <FontAwesomeIcon
                        className={styles.startIcon}
                        alt={t('Start a new query')}
                        icon="plus-circle"
                    />
                    {t('Start a new query')}
                </button>
            )}
            {clicked && (
                <div className={styles.setTitle}>
                    <input
                        autoFocus
                        className={styles.queryTitle}
                        placeholder={t('Enter a query title')}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button
                        onClick={() => startCreate()}
                        type="button"
                        className={styles.entryButton}
                        disabled={title.length === 0}
                    >
                        <FontAwesomeIcon
                            alt={t('Create query')}
                            icon="chevron-circle-right"
                        />
                    </button>
                </div>
            )}
        </div>
    );
};

export default StartNewQuery;
