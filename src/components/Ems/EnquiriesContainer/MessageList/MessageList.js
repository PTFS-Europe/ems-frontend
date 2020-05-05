import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMessages } from '../../../../store/messages/messagesActions';
import { fetchUsers } from '../../../../store/users/usersActions';
import Message from './Message/Message';
import LoadingSpinner from '../../../UI/LoadingSpinner/LoadingSpinner';

import styles from './MessageList.module.css';

const MessageList = () => {
    const { t } = useTranslation();
    // Make the state we need available
    const stateMessages = useSelector((state) => state.messages);
    const stateUsers = useSelector((state) => state.users);
    const activeUser = useSelector((state) => state.activeUser);

    // Enable us to dispatch
    const dispatch = useDispatch();

    const getParticipants = (messages) => {
        const all = messages.map((message) => message.creator_id);
        const uniques = new Set(all);
        return [...uniques];
    };

    // When we're mounted, fetch the messages
    useEffect(() => {
        dispatch(fetchMessages());
    }, [dispatch]);

    // We may need to populate information about the users
    // involved with the messages we have
    useEffect(() => {
        const participants = getParticipants(stateMessages.messageList);
        dispatch(fetchUsers({ user_ids: participants }));
    }, [stateMessages.messageList, dispatch]);

    if (!stateMessages) {
        return <LoadingSpinner />;
    }

    return (
        <section className={styles.messages}>
            {stateMessages.loading && <LoadingSpinner />}
            {!stateMessages.loading &&
                stateMessages.messageList &&
                stateMessages.messageList.length === 0 && (
                    <h1 className={styles.noMessages}>
                        {t('No messages found')}
                    </h1>
                )}
            <ol className={styles.messagesList}>
                {stateMessages.messageList &&
                    stateMessages.messageList.map((message) => (
                        <Message
                            key={message.id}
                            message={message}
                            user={stateUsers.usersList.find(
                                (user) => user.id === message.creator_id
                            )}
                            activeUser={activeUser.userDetails}
                        />
                    ))}
            </ol>
        </section>
    );
};

export default MessageList;
