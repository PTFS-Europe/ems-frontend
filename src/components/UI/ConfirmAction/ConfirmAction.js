import React from 'react';
import Popover from 'react-tiny-popover';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ConfirmAction.module.scss';

const ConfirmContent = ({ onConfirm, onCancel }) => {
    const { t } = useTranslation();

    return (
        <div role="dialog" className={styles.container}>
            <button
                className={`${styles.button} ${styles.confirm}`}
                onClick={onConfirm}
            >
                <FontAwesomeIcon
                    alt={t('Confirm action')}
                    icon={'check-circle'}
                />
            </button>
            <button
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

export default ConfirmAction;
