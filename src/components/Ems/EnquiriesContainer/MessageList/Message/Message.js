import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    setActiveMessageId,
    setActiveMessageText
} from '../../../../../store/activeMessage/activeMessageActions';
import { deleteMessage } from '../../../../../store/messages/messagesActions';
import MessageActions from '../MessageActions/MessageActions';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';
import useMostRecentSeen from '../../../../../hooks/useMostRecentSeen';

import styles from './Message.module.scss';

const Message = ({ message, isSender, position }) => {
    const { t } = useTranslation();

    const [ref] = useMostRecentSeen(message);

    const dispatch = useDispatch();

    // Compile the list of styles this message needs
    const stylesList = [styles.message];
    stylesList.push(position === 'left' ? styles.messageStaff : styles.messageCustomer);
    if (message.pending) {
        stylesList.push(styles.pending);
    }
    const finalStyles = stylesList.join(' ');

    const deleteMess = () => {
        dispatch(deleteMessage(message));
    };

    const editMess = () => {
        dispatch(setActiveMessageId(message.id));
        dispatch(setActiveMessageText(message.content));
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

    const getMessageTextStyle = () => {
        return [
            styles.messageText,
            styles[`messageText-${position}`]
        ].join(' ');
    };

    const getActionContainerStyle = () => {
        return [
            styles.actionContainer,
            styles[`actionContainer-${position}`]
        ].join(' ');
    };

    // Determine what we should display for this message
    const messageDisplay = () => {
        if (message.content) {
            return message.content;
        } else {
            const url = process.env.NODE_ENV === 'production' ?
                '/' :
                `${process.env.REACT_APP_API_BASE}/`;
            const filePath = `${url}download/${message.filename}`;
            return (
                <div className={styles.attachment}>
                    {message.uploading && <LoadingSpinner colour={'#fff'} />}
                    {!message.uploading && (
                        <div className={styles.fileIcon}>
                            <a aria-label={t('Download') + ` ${message.filename}`} href={filePath}>
                                <FontAwesomeIcon
                                    alt={t('Download') + ` ${message.filename}`}
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

    const messageText = (
        <div className={getMessageTextStyle()}>
            <div>
                {/* ^^^ Do not remove this div, it preserves the
                    vertical-ness of the text & "edited" */}
                {messageDisplay()}
                {message.created_at !== message.updated_at && (
                    <div className={styles.edited}>(edited)</div>
                )}
            </div>
        </div>
    );

    const actionButtons = () =>
        isSender ? (
            <div className={getActionContainerStyle()}>
                <MessageActions actions={validActions()} />
            </div>
        ) : null;

    return position === 'left' ? (
        <li ref={ref} className={finalStyles}>
            {messageText}
            {actionButtons()}
        </li>
    ) : (
        <li ref={ref} className={finalStyles}>
            {actionButtons()}
            {messageText}
        </li>
            
    );
};

Message.propTypes = {
    message: PropTypes.object.isRequired,
    isSender: PropTypes.bool.isRequired,
    position: PropTypes.string.isRequired
};

export default Message;
