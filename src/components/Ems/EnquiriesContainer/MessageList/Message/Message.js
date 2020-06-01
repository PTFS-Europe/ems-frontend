import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { deleteMessage } from '../../../../../store/messages/messagesActions';
import MessageActions from '../MessageActions/MessageActions';

import styles from './Message.module.scss';

const Message = ({ message, css, isSender, updateMessage }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    // Compile the list of styles this message needs
    const stylesList = [styles.message, styles[css]];
    if (message.pending) {
        stylesList.push(styles.pending);
    }
    const finalStyles = stylesList.join(' ');

    const deleteMess = () => {
        dispatch(deleteMessage({ id: message.id }));
    };

    const editMess = () => {
        updateMessage(message);
    };

    return (
        <li className={finalStyles}>
            <span className={styles.messageText}>
                {message.content}
                {message.created_at !== message.updated_at && (
                    <div className={styles.edited}>(edited)</div>
                )}
            </span>
            {isSender && (
                <div className={styles.actionContainer}>
                    <MessageActions
                        actions={{
                            edit: {
                                alt: t('Edit this message'),
                                callback: editMess,
                                icon: 'pencil-alt'
                            },
                            delete: {
                                alt: t('Delete this message'),
                                callback: deleteMess,
                                icon: 'trash-alt'
                            }
                        }}
                    />
                </div>
            )}
        </li>
    );
};

Message.propTypes = {
    css: PropTypes.string,
    message: PropTypes.object.isRequired
};

export default Message;
