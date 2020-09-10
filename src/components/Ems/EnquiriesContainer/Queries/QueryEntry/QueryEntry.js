import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';

import * as messagesTypes from '../../../../../store/messages/messagesTypes';
import {
    sendMessage,
    editMessage,
    uploadFile
} from '../../../../../store/messages/messagesActions';
import {
    setActiveMessageId,
    setActiveMessageText
} from '../../../../../store/activeMessage/activeMessageActions';

import styles from './QueryEntry.module.scss';

const QueryEntry = ({ match }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const stateMessages = useSelector((state) => state.messages);
    const stateActiveMessage = useSelector((state) => state.activeMessage);

    // The ID of the query currently being viewed
    const queryId = parseInt(match.params.queryId);

    const getStyle = () => stateActiveMessage.id ? styles.edit : '';

    // Call the redux action for sending the message to the API
    const dispatchSendAction = () => {
        // We pass the query ID that the message is being sent
        // to, also the body of the message. The API call
        // requires the active user, the action determines this
        // before sending the request
        dispatch(
            sendMessage({
                queryId,
                message: stateActiveMessage.text
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
        dispatch(editMessage(
            { id: stateActiveMessage.id, text: stateActiveMessage.text }
        )).then((data) => {
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
        dispatch(setActiveMessageText(''))
        dispatch(setActiveMessageId(null));
    };

    // Catch the enter key being pressed
    const keyIsPressed = (e) => {
        if (e.key === 'Enter') {
            // Prevent the newline from being added
            e.preventDefault();
            if (stateActiveMessage.id) {
                dispatchEditAction();
            } else {
                dispatchSendAction();
            }
        }
    };

    // Should the file upload be disabled, if so return
    // the appropriate style
    const uploadDisabled = () => {
        return stateActiveMessage.text.length > 0 || stateMessages.loading
            ? styles.fileLabelDisabled
            : '';
    };

    const handleUpload = (event) => {
        dispatch(uploadFile(event.target.files, queryId));
    };

    return (
        <form className={styles.entryContainer}>
            <TextareaAutosize
                value={stateActiveMessage.text}
                onInput={(e) =>
                    dispatch(
                        setActiveMessageText(e.target.value)
                    )
                }
                onKeyPress={keyIsPressed}
                maxRows={10}
                placeholder={t('Type your message')}
                className={`${styles.entryBox} ${getStyle()}`}
            ></TextareaAutosize>
            <div className={`${styles.entryIconsContainer} ${getStyle()}`}>
                {!stateActiveMessage.id && (
                    <div className={styles.entryIcons}>
                        <label
                            data-testid="fileattachlabel"
                            className={`${styles.fileLabel
                                } ${uploadDisabled()}`}
                        >
                            <FontAwesomeIcon
                                alt={t('Create an attachment')}
                                icon="paperclip"
                            />
                            <input
                                multiple
                                data-testid="fileattach"
                                onChange={handleUpload}
                                disabled={
                                    stateActiveMessage.text.length > 0 ||
                                    stateMessages.loading
                                }
                                type="file"
                                className={styles.fileInput}
                                aria-label={t('File picker')}
                            />
                        </label>
                        <button
                            type="button"
                            className={styles.entryButton}
                            onClick={dispatchSendAction}
                            disabled={
                                stateActiveMessage.text.length === 0 ||
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
                {stateActiveMessage.id && (
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
                            disabled={stateActiveMessage.text.length === 0}
                        >
                            <FontAwesomeIcon
                                alt={t('Save changes')}
                                icon="check"
                            />
                        </button>
                    </div>
                )}
            </div>
        </form >
    );
};

export default withRouter(QueryEntry);
