import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useAuthTypes from '../../hooks/useAuthTypes';
import { logoutUser } from '../../store/activeUser/activeUserActions';

import styles from './Login.module.scss';

const Login = () => {
    const authTypes = useAuthTypes();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logoutUser());
    });

    const url = process.env.NODE_ENV === 'production' ?
        '/auth/' :
        `${process.env.REACT_APP_API_BASE}/auth/`;

    return (
        <div className={styles.loginContainer}>
            {authTypes.map((authType) => (
                <div key={authType.id} className={styles.authType}>
                    <a
                        href={`${url}${authType.id}`}
                    >
                        Login with {authType.name}
                    </a>
                </div>
            ))}
        </div>
    );
};

export default Login;
