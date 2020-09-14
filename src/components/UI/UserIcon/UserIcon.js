import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import Avatar, { ConfigProvider } from 'react-avatar';

const UserIcon = ({ userId }) => {
    const [user, setUser] = useState('');

    // Get hold of the userList state
    const stateUsers = useSelector((state) => state.users);

    useEffect(() => {
        const user = stateUsers.usersList.find((user) => user.id === userId);
        if (user) {
            setUser(user);
        }
    }, [userId, stateUsers.usersList]);

    return user ? (
        <figure>
            <ConfigProvider
                colors={['#d33e43', '#9b7874', '#666370', '#1c1f33']}
            >
                <Avatar
                    round={true}
                    size="40"
                    name={user.name}
                    src={user.avatar}
                ></Avatar>
            </ConfigProvider>
        </figure>
    ) : null;
};

UserIcon.propTypes = {
    userId: PropTypes.number
};

export default UserIcon;
