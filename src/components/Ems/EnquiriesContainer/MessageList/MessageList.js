import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMessages } from '../../../../store/messages/messagesActions';
import Message from './Message/Message';
import LoadingSpinner from '../../../UI/LoadingSpinner/LoadingSpinner';

import styles from './MessageList.module.css';

const MessageList = () => {
    const { t } = useTranslation();
    // Make the state we need available
    const d = useSelector((state) => state.messages);

    // Enable us to dispatch
    const dispatch = useDispatch();

    // When we're mounted, fetch the messages
    useEffect(() => {
        dispatch(fetchMessages());
    }, [dispatch]);

    if (!d) {
        return <LoadingSpinner />;
    }

    return (
        <section className={styles.messages}>
            {d.loading && <LoadingSpinner />}
            {!d.loading && d.messageList && d.messageList.length === 0 && (
                <h1 className={styles.noMessages}>{t('No messages found')}</h1>
            )}
            <ol className={styles.messagesList}>
                {d.messageList &&
                    d.messageList.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
            </ol>
        </section>
    );
};

export default MessageList;
