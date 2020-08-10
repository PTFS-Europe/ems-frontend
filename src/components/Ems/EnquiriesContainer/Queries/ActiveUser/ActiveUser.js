import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import UserIcon from '../../../../UI/UserIcon/UserIcon';
import useActiveUser from '../../../../../hooks/useActiveUser';
import api from '../../../../../util/EmsApi';
import useAuthTypes from '../../../../../hooks/useAuthTypes';

import styles from './ActiveUser.module.scss';

const ActiveUser = ({ colour = '#fff' }) => {
    const authTypes = useAuthTypes();
    const [logoutUrl, setLogoutUrl] = useState();
    const [activeUser, logout] = useActiveUser();
    const [redirect, shouldRedirect] = useState(false);

    // Make sure the logoutUrl is correct based on the method
    // the user logged in with
    useEffect(() => {
        if (authTypes.length > 0 && activeUser) {
            const authUsed = authTypes.find(
                (type) => type.id === activeUser.provider
            );
            setLogoutUrl(
                authUsed && authUsed.logoutUrl ? authUsed.logoutUrl : null
            );
        }
    }, [authTypes, activeUser]);

    // Perform the various tasks to logout this user
    const logoutUser = async () => {
        // Request the API deletes its cache of the refresh token
        await api.makeRequest('/token', { method: 'DELETE' });
        // Remove our storage of their JWT
        api.removeToken();
        // Reset the entire app state
        logout();
        // Redirect to whereever we should go
        if (!logoutUrl) {
            // This provider doesn't have a logout URL, we therefore
            // go to our default location
            shouldRedirect(true);
        } else {
            // This provider does have a logout URL, go there
            window.location = logoutUrl;
        }
    };
    if (redirect) {
        return <Redirect to="/login" />;
    } else if (!activeUser.id) {
        return null;
    } else {
        return (
            <aside className={styles.activeUser}>
                <UserIcon userId={activeUser.id} />
                <h1 className={styles.userName} style={{ color: colour }}>
                    {activeUser.name}
                </h1>
                <div onClick={logoutUser} className={styles.logout} role="link">
                    Log out
                </div>
            </aside>
        );
    }
};

export default ActiveUser;
