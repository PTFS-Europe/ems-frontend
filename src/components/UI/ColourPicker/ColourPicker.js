import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import styles from './ColourPicker.module.scss';

const colours = [
    '#c65050',
    '#d69d3f',
    '#d7de38',
    '#8ebf65',
    '#39d04b',
    '#40d1b5',
    '#5090c6',
    '#4157d0',
    '#9050c6',
    '#d345c2'
];

const ColourPicker = ({ updateColour, icon }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.swatchContainer}>
            {colours.map((colour) => (
                <button
                    aria-label={t('Label')}
                    key={colour}
                    onClick={() => updateColour({ colour })}
                    className={styles.swatch}
                >
                    {icon(colour)}
                </button>
            ))}
        </div>
    );
};

ColourPicker.propTypes = {
    updateColour: PropTypes.func.isRequired,
    icon: PropTypes.func.isRequired
};

export default ColourPicker;
