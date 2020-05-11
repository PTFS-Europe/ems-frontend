import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextareaAutosize from 'react-textarea-autosize';

import styles from './QueryEntry.module.scss';

const QueryEntry = () => {
    const { t } = useTranslation();
    return (
        <form className={styles.entryContainer}>
            <TextareaAutosize
                maxRows={10}
                placeholder={t('Type your message')}
                className={styles.entryBox}
            ></TextareaAutosize>
            <div className={styles.entryIconsContainer}>
                <div className={styles.entryIcons}>
                    <button className={styles.entryButton}>
                        <FontAwesomeIcon
                            alt={t('Create an attachment')}
                            icon="paperclip"
                        />
                    </button>
                    <button className={styles.entryButton}>
                        <FontAwesomeIcon
                            alt={t('Send message')}
                            icon="paper-plane"
                        />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default QueryEntry;
