import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';

import * as messagesTypes from '../../../../../store/messages/messagesTypes';
import { sendMessage } from '../../../../../store/messages/messagesActions';

import styles from './QueryEntry.module.scss';

const QueryEntry = ({ match }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const stateMessages = useSelector((state) => state.messages);

    const [message, setMessage] = useState('');

    // Call the redux action for sending the message to the API
    const dispatchSendAction = () => {
        // The ID of the query currently being viewed
        const queryId = parseInt(match.params.queryId);
        // We pass the query ID that the message is being sent
        // to, also the body of the message. The API call
        // requires the active user, the action determines this
        // before sending the request
        dispatch(
            sendMessage({
                queryId,
                message
            })
        ).then((data) => {
            // The call to sendMessage may have returned an error, so we
            // need to check for that
            if (data.type === messagesTypes.SEND_MESSAGE_SUCCESS) {
                // The call was successful, we can clear the entry
                resetEntry();
            }
        });
    };

    // Reset the entry box
    const resetEntry = () => {
        setMessage('');
    };

    // Catch the enter key being pressed
    const keyIsPressed = (e) => {
        if (e.key === 'Enter') {
            // Prevent the newline from being added
            e.preventDefault();
            dispatchSendAction();
        }
    };

    return (
        <form className={styles.entryContainer}>
            <TextareaAutosize
                value={message}
                onInput={(e) => setMessage(e.target.value)}
                onKeyPress={keyIsPressed}
                maxRows={10}
                placeholder={t('Type your message')}
                className={styles.entryBox}
            ></TextareaAutosize>
            <div className={styles.entryIconsContainer}>
                <div className={styles.entryIcons}>
                    <button
                        type="button"
                        disabled={message.length > 0 || stateMessages.loading}
                        className={styles.entryButton}
                    >
                        <FontAwesomeIcon
                            alt={t('Create an attachment')}
                            icon="paperclip"
                        />
                    </button>
                    <button
                        type="button"
                        className={styles.entryButton}
                        onClick={dispatchSendAction}
                        disabled={message.length === 0 || stateMessages.loading}
                    >
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

export default withRouter(QueryEntry);
