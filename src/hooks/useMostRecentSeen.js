import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useInView } from 'react-intersection-observer';

import { setMounted } from '../store/unseen/unseenActions';

import { updateMostRecentSeen } from '../store/unseen/unseenActions';

export default (message) => {
    const stateQueries = useSelector((state) => state.queries);
    const stateMessages = useSelector((state) => state.messages);
    const activeQuery = stateQueries.activeQuery;
    const stateUnseen = useSelector((state) => state.unseen);
    const mostRecentSeen = stateUnseen.mostRecentSeen;

    const dispatch = useDispatch();

    // Monitor when this message enters the viewport
    const [ref, inView] = useInView({
        threshold: 1
    });

    // We cannot reliably know if we're visible or not until us
    // and all our siblings are mounted (and the layout has therefore
    // stabilised). Therefore we watch stateUnseen.mounted, when
    // stateUnseen.mounted.length === stateMessages.messageList.length
    // then all messages in this query are mounted and we can reliably
    // start reporting our visibility
    //
    // First step, report when we're mounted
    useEffect(() => {
        // We only want to report the mounted-ness of the final
        // message ID otherwise we end up adding the temporary IDs
        // to the mounted array as well as the final ID
        // Temporary IDs are strings
        if (typeof message.id === 'number') {
            dispatch(setMounted(message.id));
        }
    }, [message.id, dispatch]);

    // Only dispatch an update if we need to
    useEffect(() => {
        if (
            stateUnseen.mounted &&
            stateMessages.messageList &&
            // Are all the messages mounted, as described above
            stateUnseen.mounted.length === stateMessages.messageList.length &&
            // Are we visible
            inView &&
            // Has mostRecentSeen been properly populated
            Object.prototype.hasOwnProperty.call(
                mostRecentSeen, activeQuery.id
            ) &&
            // Are we more recent
            message.id > mostRecentSeen[activeQuery.id]
        ) {
            dispatch(
                updateMostRecentSeen({
                    queryId: activeQuery.id,
                    messageId: message.id
                })
            );
        }
    }, [
        inView,
        mostRecentSeen,
        activeQuery,
        dispatch,
        message.id,
        stateMessages.messageList,
        stateUnseen.mounted
    ]);

    return [ref];
};
