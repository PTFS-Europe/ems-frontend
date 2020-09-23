import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    setQuerySearch,
    updateActiveQuery
} from '../../../store/queries/queriesActions';
import styles from './StartButton.module.scss';

const StartButton = () => {
    const { t } = useTranslation();

    const history = useHistory();

    const dispatch = useDispatch();

    // Initiate query creation
    const startNewQuery = () => {
        dispatch(setQuerySearch(''));
        dispatch(updateActiveQuery());
        history.push('/');
    };
    return (
        <button onClick={() => startNewQuery()} className={styles.startButton}>
            <FontAwesomeIcon
                className={styles.startIcon}
                alt={t('Start a new query')}
                icon="plus-circle"
            />
            {t('Start a new query')}
        </button>
    );
};

export default StartButton;
