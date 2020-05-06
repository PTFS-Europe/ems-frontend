import React from 'react';
import PropTypes from 'prop-types';
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
                <h1 className={styles.creator}>{getSenderText()}</h1>
                <div data-testid="message-content" className={styles.body}>
                    {message.content}
                </div>
                <div
                    data-testid="message-timestamp"
                    className={styles.timestamp}
                >
                    {moment(message.updated_at).fromNow()}
                </div>
            </div>
        </li>
    );
};

Message.propTypes = {
    message: PropTypes.object.isRequired,
    user: PropTypes.object,
    activeUser: PropTypes.object.isRequired
};

export default Message;
