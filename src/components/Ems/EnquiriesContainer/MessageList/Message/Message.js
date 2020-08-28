import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { deleteMessage } from '../../../../../store/messages/messagesActions';
import MessageActions from '../MessageActions/MessageActions';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';
import useMostRecentSeen from '../../../../../hooks/useMostRecentSeen';

import styles from './Message.module.scss';

const Message = ({ message, css, isSender, updateMessage }) => {
    const { t } = useTranslation();

    const [ref] = useMostRecentSeen(message);

    const dispatch = useDispatch();

    // Compile the list of styles this message needs
    const stylesList = [styles.message, styles[css]];
    if (message.pending) {
        stylesList.push(styles.pending);
    }
    const finalStyles = stylesList.join(' ');

    const deleteMess = () => {
        dispatch(deleteMessage(message));
    };

    const editMess = () => {
        updateMessage(message);
    };

    // Determine the valid actions for this message
    const validActions = () => {
        let actions = {};
        if (message.content) {
            actions.edit = {
                alt: t('Edit this message'),
                callback: editMess,
                icon: 'pencil-alt'
            };
        }
        actions.delete = {
            alt: t('Delete this message'),
            callback: deleteMess,
            icon: 'trash-alt'
        };
        return actions;
    };

    // Determine what we should display for this message
    const messageDisplay = () => {
        if (message.content) {
            return message.content;
        } else {
            const filePath = `${process.env.REACT_APP_API_BASE}/download/${message.filename}`;
            return (
                <div className={styles.attachment}>
                    {message.uploading && <LoadingSpinner colour={'#fff'} />}
                    {!message.uploading && (
                        <div className={styles.fileIcon}>
                            <a href={filePath}>
                                <FontAwesomeIcon
                                    alt={'Download'}
                                    icon={'download'}
                                />
                            </a>
                        </div>
                    )}
                    <div className={styles.filename}>
                        {message.originalname}
                    </div>
                </div>
            );
        }
    };

    return (
        <li ref={ref} className={finalStyles}>
            <div className={styles.messageText}>
                <div>
                    {/* ^^^ Do not remove this div, it preserves the vertical-ness of the text & "edited" */}
                    {messageDisplay()}
                    {message.created_at !== message.updated_at && (
                        <div className={styles.edited}>(edited)</div>
                    )}
                </div>
            </div>
            {isSender && (
                <div className={styles.actionContainer}>
                    <MessageActions actions={validActions()} />
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
