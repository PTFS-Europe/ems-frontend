import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMessages } from '../../../../store/messages/messagesActions';
import MessageCollection from './MessageCollection/MessageCollection';
import LoadingSpinner from '../../../UI/LoadingSpinner/LoadingSpinner';
import useActiveUser from '../../../../hooks/useActiveUser';

import messageCollections from '../../../../util/messages';

import styles from './MessageList.module.scss';

const MessageList = () => {
    const { t } = useTranslation();

    const [initiator, setInitiator] = useState(0);

    const myRef = useRef(null);

    // Make the state we need available
    const stateMessages = useSelector((state) => state.messages);
    const stateQueries = useSelector((state) => state.queries);
    const stateUnseen = useSelector((state) => state.unseen);
    const [activeUser] = useActiveUser();

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
        if (stateQueries && stateQueries.activeQuery) {
            const query = stateQueries.queryList.find(
                (query) => parseInt(query.id) === parseInt(stateQueries.activeQuery.id)
            );
            if (query) {
                setInitiator(query.initiator);
            }
        }
    }, [stateQueries, stateQueries.activeQuery.id]);

    // When the messageList changes (e.g. a new message comes in)
    // scroll to the bottom of the messages if appropriate
    useEffect(() => {
        // We're testing for scrollIntoView here because the unit
        // test complains about the subsequent call of it. I've not
        // been able to find a way to mock it in the test, so have
        // resorted to preventing it being called in the test :-(
        if (
            stateUnseen.mounted.length === stateMessages.messageList.length &&
            myRef.current.scrollIntoView
        ) {
            myRef.current.scrollIntoView();
        }
    }, [stateUnseen.mounted, stateMessages.messageList]);

    // When we're mounted, fetch the messages
    useEffect(() => {
        if (stateQueries.activeQuery) {
            dispatch(fetchMessages({ queryId: stateQueries.activeQuery.id }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, stateQueries.activeQuery.id]);

    // Should we display the "Thank you" message
    const shouldDisplayThanks = () => {
        if (
            stateMessages.messageList.length === 0 ||
            stateUsers.usersList.length === 0 ||
            !activeUser.id
        ) {
            return false;
        }
        const lastMessage = stateMessages.messageList[
            stateMessages.messageList.length - 1
        ];
        const sender = stateUsers.usersList.find(
            (user) => user.id === lastMessage.creator_id
        );
        return sender &&
            sender.id === activeUser.id &&
            sender.role_code !== 'STAFF';
    };

    if (!stateMessages) {
        return <LoadingSpinner />;
    }

    return (
        <section
            className={styles.messages}
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
                            initiator={initiator}
                            key={collection.id}
                            collection={collection}
                            activeUser={activeUser}
                            usersList={stateUsers.usersList}
                        ></MessageCollection>
                    ))}
                {shouldDisplayThanks() && (
                    <li className={styles.thankYou}>{t('Thank you for your message, one of our staff will reply as soon as possible')}</li>
                )}
                <li ref={myRef}></li>
            </ol>
        </section>
    );
};

export default MessageList;
