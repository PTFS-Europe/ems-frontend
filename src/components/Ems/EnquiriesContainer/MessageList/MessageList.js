import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMessages } from '../../../../store/messages/messagesActions';
import { fetchUsers } from '../../../../store/users/usersActions';
import MessageCollection from './MessageCollection/MessageCollection';
import LoadingSpinner from '../../../UI/LoadingSpinner/LoadingSpinner';

import messageCollections from '../../../../util/messages';

import styles from './MessageList.module.scss';

const MessageList = () => {
    const { t } = useTranslation();

    // Make the state we need available
    const stateMessages = useSelector((state) => state.messages);
    const activeUser = useSelector((state) => state.activeUser);
    // We grab the usersList here and pass it down to MessageCollection
    // because otherwise every instance of MessageCollection will be
    // independently grabbing it, which has to be worse performance-wise
    const stateUsers = useSelector((state) => state.users);

    // Enable us to dispatch
    const dispatch = useDispatch();

    // The messages we display are behind a memoized method that calculates
    // their groupings, this should prevent uncessary recalculations
    const memMessages = useMemo(
        () => messageCollections(stateMessages.messageList.messages),
        [stateMessages.messageList]
    );

    const getParticipants = (messages, additional = []) => {
        let all = [
            ...messages.map((message) => message.creator_id),
            ...additional
        ];
        const uniques = new Set(all);
        return [...uniques];
    };

    // When we're mounted, fetch the messages
    useEffect(() => {
        dispatch(fetchMessages({ queryId: 33 }));
    }, [dispatch]);

    // We may need to populate information about the users
    // involved with the messages we have
    useEffect(() => {
        if (stateMessages.messageList.messages && activeUser.userDetails) {
            const participants = getParticipants(
                stateMessages.messageList.messages,
                [stateMessages.messageList.initiator, activeUser.userDetails.id]
            );
            dispatch(fetchUsers({ user_ids: participants }));
        }
    }, [stateMessages.messageList, dispatch, activeUser.userDetails]);

    if (!stateMessages) {
        return <LoadingSpinner />;
    }

    return (
        <section className={styles.messages}>
            {stateMessages.loading && <LoadingSpinner />}
            {!stateMessages.loading &&
                stateMessages.messageList.messages &&
                stateMessages.messageList.messages.length === 0 && (
                    <h1 className={styles.noMessages}>
                        {t('No messages found')}
                    </h1>
                )}
            <ol className={styles.messagesList}>
                {stateMessages.messageList.messages &&
                    // We pass our collection-ified messages,
                    // rather than the message list
                    memMessages.map((collection) => (
                        <MessageCollection
                            initiator={stateMessages.messageList.initiator}
                            key={collection.timestamp}
                            collection={collection}
                            activeUser={activeUser.userDetails}
                            usersList={stateUsers.usersList}
                        ></MessageCollection>
                    ))}
            </ol>
        </section>
    );
};

export default MessageList;
