import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMessages } from '../../../../store/messages/messagesActions';
import { fetchUsers } from '../../../../store/users/usersActions';
import MessageCollection from './MessageCollection/MessageCollection';
import LoadingSpinner from '../../../UI/LoadingSpinner/LoadingSpinner';
import { debounce } from '../../../../util/ui';

import messageCollections from '../../../../util/messages';

import styles from './MessageList.module.scss';

const MessageList = ({ match, updateMessage }) => {
    const { t } = useTranslation();

    const [initiator, setInitiator] = useState(0);
    const [scrollPosition, setScrollPosition] = useState();

    const myRef = useRef(null);

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

    // If a new query is loaded, reset our scroll position
    useEffect(() => {
        setScrollPosition();
    }, [queryId]);

    // When the messageList changes (e.g. a new message comes in)
    // scroll to the bottom of the messages if appropriate
    useEffect(() => {
        // We're testing for scrollIntoView here because the unit
        // test complains about the subsequent call of it. I've not
        // been able to find a way to mock it in the test, so have
        // resorted to preventing it being called in the test :-(
        if (!scrollPosition && myRef.current.scrollIntoView) {
            myRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [stateMessages.messageList, scrollPosition]);

    // We may need to populate information about the users
    // involved with the messages we have
    useEffect(() => {
        if (initiator && activeUser.userDetails && stateMessages) {
            // Get the query's participants
            const query = stateQueries.queryList.find(
                (query) => query.id === queryId
            );
            const msgParticipants = query.participants;
            if (msgParticipants && msgParticipants.length > 0) {
                const participants = new Set([
                    initiator,
                    activeUser.userDetails.id,
                    ...msgParticipants
                ]);
                dispatch(fetchUsers({ user_ids: [...participants] }));
            }
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

    // We need to debounce the updating of our scroll position
    const debounceScrollUpdate = debounce((data) => {
        const newScrollPosition = data.scrollHeight - data.scrollTop;
        // If we have scrolled to the bottom, we want to nullify
        // scrollPosition
        const newScrollValue =
            newScrollPosition === data.clientHeight ? null : data;
        setScrollPosition(newScrollValue);
    }, 500);

    return (
        <section
            className={styles.messages}
            onScroll={(e) =>
                debounceScrollUpdate({
                    scrollHeight: e.target.scrollHeight,
                    scrollTop: e.target.scrollTop,
                    clientHeight: e.target.clientHeight
                })
            }
        >
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
                            updateMessage={updateMessage}
                            initiator={initiator}
                            key={collection.id}
                            collection={collection}
                            activeUser={activeUser.userDetails}
                            usersList={stateUsers.usersList}
                        ></MessageCollection>
                    ))}
                <li ref={myRef}></li>
            </ol>
        </section>
    );
};

MessageList.propTypes = {
    match: PropTypes.object.isRequired
};

export default withRouter(MessageList);
