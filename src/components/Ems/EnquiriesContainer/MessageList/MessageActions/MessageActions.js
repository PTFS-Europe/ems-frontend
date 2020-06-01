import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './MessageActions.module.scss';

const MessageActions = ({ actions }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container} role="group">
            <button className={`${styles.actionButton} ${styles.default}`}>
                <FontAwesomeIcon alt={t('Make changes')} icon="ellipsis-h" />
            </button>
            {actions &&
                Object.keys(actions).map((action) => (
                    <button
                        key={action}
                        onClick={actions[action].callback}
                        className={`${styles.actionButton} ${styles[action]}`}
                    >
                        <FontAwesomeIcon
                            alt={actions[action].alt}
                            icon={actions[action].icon}
                        />
                    </button>
                ))}
        </div>
    );
};

MessageActions.propTypes = {
    actions: PropTypes.object.isRequired
};

export default MessageActions;
