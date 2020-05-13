import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import Message from '../Message/Message';
import UserIcon from '../../../../UI/UserIcon/UserIcon';

import styles from './MessageCollection.module.scss';

const MessageCollection = ({
    collection,
    activeUser,
    initiator,
    usersList
}) => {
    const [display, setDisplay] = useState({});
    const { t } = useTranslation();

    // Get the display properties for this collection, these are determined
    // by the sender and whether or not that is the initiator of the
    // query and if the collection sender is the current user
    useEffect(() => {
        if (usersList.length > 0 && activeUser) {
            const cSender = collection.sender;
            const senderObj = usersList.find((ul) => ul.id === cSender);
            setDisplay({
                displayName:
                    cSender === activeUser.id ? t('You') : senderObj.name,
                css:
                    cSender === initiator
                        ? 'collectionLeft'
                        : 'collectionRight',
                messageCss:
                    cSender === initiator ? 'messageStaff' : 'messageCustomer'
            });
        }
        // Disabling the linting here because it wants us to add
        // t as a dependency, but doing so causes the tests for
        // this component to go into an endless loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeUser, collection, initiator, usersList]);

    // Return the align-items property for a given collection
    return (
        <div role="group" className={styles[display.css]}>
            <UserIcon />
            <div className={styles.collectionContent}>
                <h1 className={styles.creator}>{display.displayName}</h1>
                <ol className={styles.messages}>
                    {collection.messages.map((message) => (
                        <Message
                            css={display.messageCss}
                            key={message.id}
                            message={message}
                        />
                    ))}
                </ol>
                <div
                    data-testid="message-timestamp"
                    className={styles.timestamp}
                >
                    {moment(collection.timestamp).fromNow()}
                </div>
            </div>
        </div>
    );
};

MessageCollection.propTypes = {
    activeUser: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    usersList: PropTypes.array.isRequired,
    initiator: PropTypes.number.isRequired
};

export default MessageCollection;
