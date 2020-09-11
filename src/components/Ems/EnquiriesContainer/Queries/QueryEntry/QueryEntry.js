import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as messagesTypes from '../../../../../store/messages/messagesTypes';
import {
    sendMessage,
    editMessage,
    uploadFile
} from '../../../../../store/messages/messagesActions';
import MessageEntry from '../../../../UI/MessageEntry/MessageEntry';

import styles from './QueryEntry.module.scss';

const QueryEntry = () => {

    const dispatch = useDispatch();
    const stateQueries = useSelector((state) => state.queries);
    const stateActiveMessage = useSelector((state) => state.activeMessage);

    // Call the redux action for sending the message to the API
    const dispatchSendAction = (callback) => {
        // We pass the query ID that the message is being sent
        // to, also the body of the message. The API call
        // requires the active user, the action determines this
        // before sending the request
        dispatch(
            sendMessage({
                queryId: stateQueries.activeQuery,
                message: stateActiveMessage.text
            })
        ).then((data) => {
            // The call to sendMessage may have returned an error, so we
            // need to check for that
            if (data.type === messagesTypes.SEND_MESSAGE_SUCCESS) {
                // The call was successful, we can call any passed
                // callback
                if (callback) {
                    callback();
                }
            }
        });
    };

    // Call the redux action for sending the edited message to the API
    const dispatchEditAction = (callback) => {
        dispatch(editMessage(
            { id: stateActiveMessage.id, text: stateActiveMessage.text }
        )).then((data) => {
            // The call to editMessage may have returned an error, so we
            // need to check for that
            if (data.type === messagesTypes.EDIT_MESSAGE_SUCCESS) {
                // The call was successful, we can call any passed callback
                if (callback) {
                    callback();
                }
            }
        });
    };

    const dispatchUpload = (event) => {
        dispatch(uploadFile(event.target.files, stateQueries.activeQuery));
    };

    return (
        <div className={styles.container}>
            <MessageEntry
                dispatchSendAction={dispatchSendAction}
                dispatchEditAction={dispatchEditAction}
                dispatchUpload={dispatchUpload}
            />
        </div>
    );
};

export default QueryEntry;
