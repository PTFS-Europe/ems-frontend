import React from 'react';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './StartButton.module.scss';

const StartButton = () => {
    const { t } = useTranslation();

    const history = useHistory();

    // Initiate query creation
    const startNewQuery = () => {
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
