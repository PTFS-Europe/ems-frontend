import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import QueryHeader from '../QueryHeader/QueryHeader';
import NewQuery from '../NewQuery/NewQuery';
import Welcome from '../../../../UI/Welcome/Welcome';
import MessageList from '../../MessageList/MessageList';
import QueryEntry from '../QueryEntry/QueryEntry';
import { updateActiveQuery } from '../../../../../store/queries/queriesActions';
import useActiveUser from '../../../../../hooks/useActiveUser';

import styles from './ActiveQuery.module.scss';

const ActiveQuery = ({ match }) => {
    const dispatch = useDispatch();

    const [activeUser] = useActiveUser();

    const queryId = match.params.queryId;

    // Ensure our state has the active query set
    useEffect(() => {
        dispatch(updateActiveQuery(parseInt(queryId)));
        // When we unmount, reset the state property
        return () => {
            dispatch(updateActiveQuery(null));
        };
        // We don't want dispatch to be a dependency of this hook
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryId]);

    // Front page content
    const getFrontPage = () => {
        // Don't display anything until we're ready
        if (!activeUser.role_code) {
            return null;
        }
        if (activeUser.role_code === 'STAFF') {
            return <Welcome />;
        } else {
            return <NewQuery />;
        }
    };

    return (
        <main className={styles.activeQuery}>
            <QueryHeader />
            {!queryId && getFrontPage()}
            {queryId && <MessageList />}
            {queryId && <QueryEntry className={styles.queryEntry} />}
        </main>
    );
};

ActiveQuery.propTypes = {
    match: PropTypes.object.isRequired
};

export default withRouter(ActiveQuery);
