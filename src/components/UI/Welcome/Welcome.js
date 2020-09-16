import React from 'react';

import { useTranslation } from 'react-i18next';

import useActiveUser from '../../../hooks/useActiveUser';

import styles from './Welcome.module.scss';

const Welcome = () => {
    const { t } = useTranslation();

    const [activeUser] = useActiveUser();

    return (
        <section className={styles.welcome}>
            {t('Welcome')} <br /> {activeUser.name}
        </section>
    );
};

export default Welcome;
