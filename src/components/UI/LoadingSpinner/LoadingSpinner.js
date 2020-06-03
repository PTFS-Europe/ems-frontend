import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = () => {
    const { t } = useTranslation();

    return (
        <div
            role="alert"
            aria-live="assertive"
            aria-label={t('Loading')}
            title={t('Loading')}
            className={styles.loadingSpinner}
        >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default LoadingSpinner;
