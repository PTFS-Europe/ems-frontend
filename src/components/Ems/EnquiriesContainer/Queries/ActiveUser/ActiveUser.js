import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import UserIcon from '../../../../UI/UserIcon/UserIcon';
import useActiveUser from '../../../../../hooks/useActiveUser';
import api from '../../../../../classes/EmsApi';
import useAuthTypes from '../../../../../hooks/useAuthTypes';

import styles from './ActiveUser.module.scss';

const ActiveUser = ({ colour = '#fff' }) => {
    const { t } = useTranslation();
    const authTypes = useAuthTypes();
    const [logoutUrl, setLogoutUrl] = useState();
    const [activeUser] = useActiveUser();
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

    const getLayout = () =>
        activeUser.role_code === 'STAFF' ? (
            <aside className={styles.activeUserStaff}>
                <UserIcon userId={activeUser.id} />
                <h1 className={styles.userName} style={{ color: colour }}>
                    {activeUser.name}
                </h1>
                <button
                    onClick={logoutUser}
                    className={
                        activeUser.role_code === 'STAFF'
                            ? styles.logoutStaff
                            : styles.logoutCustomer
                    }
                >
                    {t('Log out')}
                </button>
            </aside>
        ) : (
            <aside className={styles.activeUserCustomer}>
                <div className={styles.iconName}>
                    <UserIcon userId={activeUser.id} />
                    <h1 className={styles.userName} style={{ color: colour }}>
                        {activeUser.name}
                    </h1>
                </div>
                <button
                    onClick={logoutUser}
                    className={
                        activeUser.role_code === 'STAFF'
                            ? styles.logoutStaff
                            : styles.logoutCustomer
                    }
                >
                    {t('Log out')}
                </button>
            </aside>
        );

    if (redirect) {
        return <Redirect to="/login" />;
    } else if (!activeUser.id) {
        return null;
    } else {
        return getLayout();
    }
};

export default ActiveUser;
