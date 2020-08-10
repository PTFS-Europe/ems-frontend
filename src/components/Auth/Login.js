import React from 'react';

import useAuthTypes from '../../hooks/useAuthTypes';

import styles from './Login.module.scss';

const Login = () => {
    const authTypes = useAuthTypes();

    return (
        <div className={styles.loginContainer}>
            {authTypes.map((authType) => (
                <div key={authType.id} className={styles.authType}>
                    <a
                        href={`${process.env.REACT_APP_API_BASE}/auth/${authType.id}`}
                    >
                        Login with {authType.name}
                    </a>
                </div>
            ))}
        </div>
    );
};

export default Login;
