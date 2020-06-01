import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';

import * as messagesTypes from '../../../../../store/messages/messagesTypes';
import {
    sendMessage,
    editMessage
} from '../../../../../store/messages/messagesActions';

import styles from './QueryEntry.module.scss';

const QueryEntry = ({ match, message, updateMessage }) => {
    const { t } = useTranslation();

    const [edit, setEdit] = useState('');

    const dispatch = useDispatch();
    const stateMessages = useSelector((state) => state.messages);

    useEffect(() => {
        setEdit(message.id ? styles.edit : '');
    }, [message]);

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
                message: message
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

    // Call the redux action for sending the edited message to the API
    const dispatchEditAction = () => {
        dispatch(editMessage(message)).then((data) => {
            // The call to editMessage may have returned an error, so we
            // need to check for that
            if (data.type === messagesTypes.EDIT_MESSAGE_SUCCESS) {
                // The call was successful, we can clear the entry
                resetEntry();
            }
        });
    };

    // Reset the entry box
    const resetEntry = () => {
        updateMessage({ content: '' });
    };

    // Catch the enter key being pressed
    const keyIsPressed = (e) => {
        if (e.key === 'Enter') {
            // Prevent the newline from being added
            e.preventDefault();
            if (message.id) {
                dispatchEditAction();
            } else {
                dispatchSendAction();
            }
        }
    };
    return (
        <form className={styles.entryContainer}>
            <TextareaAutosize
                value={message.content}
                onInput={(e) =>
                    updateMessage({ ...message, content: e.target.value })
                }
                onKeyPress={keyIsPressed}
                maxRows={10}
                placeholder={t('Type your message')}
                className={`${styles.entryBox} ${edit}`}
            ></TextareaAutosize>
            <div className={`${styles.entryIconsContainer} ${edit}`}>
                {!message.hasOwnProperty('id') && (
                    <div className={styles.entryIcons}>
                        <button
                            type="button"
                            disabled={
                                message.content.length > 0 ||
                                stateMessages.loading
                            }
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
                            disabled={
                                message.content.length === 0 ||
                                stateMessages.loading
                            }
                        >
                            <FontAwesomeIcon
                                alt={t('Send message')}
                                icon="paper-plane"
                            />
                        </button>
                    </div>
                )}
                {message.hasOwnProperty('id') && (
                    <div className={styles.entryIcons}>
                        <button
                            type="button"
                            onClick={resetEntry}
                            className={styles.entryButton}
                        >
                            <FontAwesomeIcon
                                alt={t('Abandon changes')}
                                icon="times"
                            />
                        </button>
                        <button
                            type="button"
                            className={styles.entryButton}
                            onClick={dispatchEditAction}
                            disabled={message.content.length === 0}
                        >
                            <FontAwesomeIcon
                                alt={t('Save changes')}
                                icon="check"
                            />
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
};

export default withRouter(QueryEntry);
