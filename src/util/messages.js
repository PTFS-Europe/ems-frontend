import moment from 'moment';

const messageCollections = (messages = []) => {
    // Only do something if we've got at least one message
    if (messages.length === 0) {
        return [];
    }

    // The period of time (10 mins) during which we think a message should
    // be grouped with its predecessor
    const groupPeriod = 600;
    // An empty collection, for when we need to create a new one
    const emptyCollection = { sender: null, messages: [], timestamp: null };
    // What we'll ultimately return
    let collections = [];

    // If this message within the allotted time period to be considered
    // part of the same collection, or the collection has no timestamp,
    // (i.e. it's a new collection)
    const isWithinPeriod = (message) => {
        // Get the timestamp of the last message in the current collection
        if (currentCollection.timestamp) {
            return (
                moment(message.created_at) -
                    moment(currentCollection.timestamp) <
                groupPeriod * 1000
            );
        } else {
            return true;
        }
    };

    // Is this message from the same sender as the collection
    // or the collection nhas no sender (i.e. it's a new collection)
    const isFromCurrentSender = (message) => {
        if (currentCollection.sender) {
            return message.creator_id === currentCollection.sender;
        } else {
            return true;
        }
    };

    // Iterate the messages and create our collections
    let currentCollection = JSON.parse(JSON.stringify(emptyCollection));
    messages.forEach((message) => {
        const sender = message.creator_id;
        const timestamp = message.created_at;
        // If this message should not be part of the current collection,
        // store the old one and create a new one
        if (
            (!isFromCurrentSender(message) || !isWithinPeriod(message)) &&
            // If we're not dealing with the first empty collection
            currentCollection.sender
        ) {
            collections.push(JSON.parse(JSON.stringify(currentCollection)));
            currentCollection = JSON.parse(JSON.stringify(emptyCollection));
        }
        currentCollection.messages.push(message);
        currentCollection.timestamp = timestamp;
        currentCollection.sender = sender;
    });
    collections.push(currentCollection);
    return collections;
};

export default messageCollections;
