import React, { useState, useEffect, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMessages } from '../../../../store/messages/messagesActions';
import { fetchUsers } from '../../../../store/users/usersActions';
import MessageCollection from './MessageCollection/MessageCollection';
import LoadingSpinner from '../../../UI/LoadingSpinner/LoadingSpinner';

import messageCollections from '../../../../util/messages';

import styles from './MessageList.module.scss';

const MessageList = ({ match }) => {
    const { t } = useTranslation();

    const [initiator, setInitiator] = useState(0);

    // Make the state we need available
    const stateMessages = useSelector((state) => state.messages);
    const stateQueries = useSelector((state) => state.queries);
    const activeUser = useSelector((state) => state.activeUser);

    // The ID of the query currently being viewed
    const queryId = parseInt(match.params.queryId);

    // We grab the usersList here and pass it down to MessageCollection
    // because otherwise every instance of MessageCollection will be
    // independently grabbing it, which has to be worse performance-wise
    const stateUsers = useSelector((state) => state.users);

    // Enable us to dispatch
    const dispatch = useDispatch();

    // The messages we display are behind a memoized method that calculates
    // their groupings, this should prevent uncessary recalculations
    const memMessages = useMemo(
        () => messageCollections(stateMessages.messageList),
        [stateMessages.messageList]
    );

    // Determine this query's initiator
    useEffect(() => {
        if (stateQueries) {
            const query = stateQueries.queryList.find(
                (query) => query.id === queryId
            );
            if (query) {
                setInitiator(query.initiator);
            }
        }
    }, [stateQueries, queryId]);

    // We may need to populate information about the users
    // involved with the messages we have
    useEffect(() => {
        if (initiator && activeUser.userDetails && stateMessages) {
            // Get the query's participants
            const query = stateQueries.queryList.find(
                (query) => query.id === queryId
            );
            const msgParticipants = query.participants;
            const participants = new Set([
                initiator,
                activeUser.userDetails.id,
                ...msgParticipants
            ]);
            dispatch(fetchUsers({ user_ids: [...participants] }));
        }
    }, [
        queryId,
        stateQueries.queryList,
        stateMessages,
        stateMessages.messageList,
        dispatch,
        activeUser.userDetails,
        initiator
    ]);

    // When we're mounted, fetch the messages
    useEffect(() => {
        dispatch(fetchMessages({ queryId }));
    }, [dispatch, queryId]);

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
                    // We pass our collection-ified messages,
                    // rather than the message list
                    memMessages.map((collection) => (
                        <MessageCollection
                            initiator={initiator}
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

export default withRouter(MessageList);
