import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { createQuery } from '../../../store/queries/queriesActions';
import MessageEntry from '../../UI/MessageEntry/MessageEntry';

import {
    sendMessage,
    uploadFile
} from '../../../store/messages/messagesActions';

import styles from './StartNewQuery.module.scss';

const StartNewQuery = () => {
    const [title, setTitle] = useState('');

    const stateQueries = useSelector((state) => state.queries);
    const stateActiveMessage = useSelector((state) => state.activeMessage);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const history = useHistory();

    const startCreate = (reset) => {
        if (title.length > 0) {
            try {
                dispatch(
                    createQuery({
                        query: title
                    })
                ).then(async (response) => {
                    const queryId = response.payload.data.id;
                    await dispatch(
                        sendMessage({
                            queryId,
                            message: stateActiveMessage.text
                        })
                    );
                    if (reset) {
                        reset();
                    }
                    history.push(`/query/${queryId}`);
                });
            } catch (err) {
                throw err;
            }
        }
    };

    const dispatchUpload = async (event) => {
        if (title.length > 0) {
            // Allow the promise callback below to access the event
            event.persist();
            try {
                dispatch(
                    createQuery({
                        query: title
                    })
                ).then(async (response) => {
                    const queryId = response.payload.data.id;
                    await dispatch(
                        uploadFile(
                            event.target.files,
                            queryId
                        )
                    );
                    history.push(`/query/${queryId}`);
                });
            } catch (err) {
                throw err;
            }
        }
    };

    return (
        <div className={styles.entryContainer}>
            <div className={styles.setTitle}>
                <input
                    autoFocus
                    className={styles.queryTitle}
                    placeholder={t('Enter a query title')}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <MessageEntry
                cssOverrides={styles}
                maxRows={15}
                minRows={15}
                dispatchSendAction={startCreate}
                dispatchEditAction={startCreate}
                dispatchUpload={dispatchUpload}
            />
        </div>
    );
};

export default StartNewQuery;
