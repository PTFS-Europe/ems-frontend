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
                colors={['#a6262a', '#705151', '#595661', '#4d5280']}
            >
                <Avatar
                    round={true}
                    size="40"
                    aria-label={user.name}
                    src={user.avatar}
                    alt={user.name}
                ></Avatar>
            </ConfigProvider>
        </figure>
    ) : null;
};

UserIcon.propTypes = {
    userId: PropTypes.number
};

export default UserIcon;
