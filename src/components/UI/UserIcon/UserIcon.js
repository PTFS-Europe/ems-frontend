import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import Avatar, { ConfigProvider } from 'react-avatar';

import styles from './UserIcon.module.scss';

const UserIcon = ({ userId }) => {
    const [name, setName] = useState('');

    // Get hold of the userList state
    const stateUsers = useSelector((state) => state.users);

    useEffect(() => {
        const user = stateUsers.usersList.find((user) => user.id === userId);
        if (user) {
            setName(user.name);
        }
    }, [userId, stateUsers.usersList]);

    return (
        <figure className={styles.userIcon}>
            <ConfigProvider
                colors={['#d33e43', '#9b7874', '#666370', '#1c1f33']}
            >
                <Avatar round={true} size="40" name={name}></Avatar>
            </ConfigProvider>
        </figure>
    );
};

UserIcon.propTypes = {
    userId: PropTypes.number
};

export default UserIcon;
