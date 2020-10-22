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
            if (cSender && senderObj) {
                setDisplay({
                    isSender: cSender === activeUser.id,
                    displayName:
                        cSender === activeUser.id ? t('You') : senderObj.name,
                    position:
                        cSender === initiator
                            ? 'left'
                            : 'right'
                });
            }
        }
        // Disabling the linting here because it wants us to add
        // t as a dependency, but doing so causes the tests for
        // this component to go into an endless loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeUser, collection, initiator, usersList]);

    // Don't render until we know the display properties
    if (!Object.prototype.hasOwnProperty.call(display, 'isSender')) {
        return null;
    }
    
    // Return appropriate styles for a given thing
    // according to their position
    const getPositionStyle = (type) => [
        styles[type],
        styles[`${type}-${display.position}`]
    ].join(' ');


    const collectionContent = (
        <div className={getPositionStyle('collectionContent')}>
            <h1 className={getPositionStyle('creator')}>{display.displayName}</h1>
            <ol className={getPositionStyle('messages')}>
                {collection.messages.map((message) => (
                    <Message
                        isSender={display.isSender}
                        position={display.position}
                        key={message.id}
                        message={message}
                    />
                ))}
            </ol>
            <div
                data-testid="message-timestamp"
                className={getPositionStyle('timestamp')}
            >
                {moment(collection.timestamp).fromNow()}
            </div>
        </div>
    );

    // Return the align-items property for a given collection
    return display.position === 'left' ? (
        <li className={getPositionStyle('collection')}>
            <UserIcon userId={collection.sender} />
            {collectionContent}
        </li>
    ) : (
        <li className={getPositionStyle('collection')}>
            {collectionContent}
            <UserIcon userId={collection.sender} />
        </li>
    );
};

MessageCollection.propTypes = {
    activeUser: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    usersList: PropTypes.array.isRequired,
    initiator: PropTypes.number.isRequired
};

export default MessageCollection;
