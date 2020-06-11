import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = ({ colour }) => {
    const { t } = useTranslation();

    const colourStyle = colour ? { background: colour } : {};

    return (
        <div
            role="alert"
            aria-live="assertive"
            aria-label={t('Loading')}
            title={t('Loading')}
            className={styles.loadingSpinner}
        >
            <div style={colourStyle}></div>
            <div style={colourStyle}></div>
            <div style={colourStyle}></div>
            <div style={colourStyle}></div>
        </div>
    );
};

LoadingSpinner.propTypes = {
    colour: PropTypes.string
};

export default LoadingSpinner;
