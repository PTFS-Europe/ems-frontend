import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-tiny-popover';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ConfirmAction.module.scss';

const ConfirmContent = ({ onConfirm, onCancel }) => {
    const { t } = useTranslation();

    return (
        <div role="dialog" className={styles.container}>
            <button
                aria-label={t('Confirm action')}
                className={`${styles.button} ${styles.confirm}`}
                onClick={onConfirm}
            >
                <FontAwesomeIcon
                    alt={t('Confirm action')}
                    icon={'check-circle'}
                />
            </button>
            <button
                aria-label={t('Cancel action')}
                className={`${styles.button} ${styles.cancel}`}
                onClick={onCancel}
            >
                <FontAwesomeIcon
                    alt={t('Cancel action')}
                    icon={'times-circle'}
                />
            </button>
        </div>
    );
};

const ConfirmAction = ({ open, onConfirm, onCancel, children }) => {
    return (
        <Popover
            isOpen={open}
            position={'top'}
            content={
                <ConfirmContent onConfirm={onConfirm} onCancel={onCancel} />
            }
            onClickOutside={onCancel}
        >
            {children}
        </Popover>
    );
};

ConfirmContent.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

ConfirmAction.propTypes = {
    open: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired
};

export default ConfirmAction;
