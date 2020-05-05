import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import UserIcon from '../../../../UI/UserIcon/UserIcon';

import styles from './Message.module.css';

const Message = ({ message, user = {}, activeUser = {} }) => {
    const { t } = useTranslation();

    const getSenderText = (id) =>
        user.id === activeUser.id ? t('You') : user.name;

    return (
        <li className={styles.message}>
            <div className={styles.creatorAvatar}>
                <UserIcon />
            </div>
            <div className={styles.content}>
                <div className={styles.creator}>{getSenderText()}</div>
                <div className={styles.body}>{message.content}</div>
                <div className={styles.timestamp}>
                    {moment(message.updated_at).fromNow()}
                </div>
            </div>
        </li>
    );
};

export default Message;
