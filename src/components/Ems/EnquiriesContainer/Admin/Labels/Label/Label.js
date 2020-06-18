import React from 'react';
import { useDispatch } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setLabelsFilter } from '../../../../../../store/labels/labelsActions';

import styles from './Label.module.scss';

const Label = ({ label, stateLabels }) => {
    // Enable us to dispatch
    const dispatch = useDispatch();

    // Set the active filter
    const setFilter = (id) => {
        dispatch(setLabelsFilter(id));
    };

    // Is a given label the active filter?
    const isSelected = (id) => {
        return id === stateLabels.filter ? styles.selected : '';
    };

    return (
        <li
            key={label.id}
            className={`${styles.label} ${isSelected(label.id)}`}
        >
            <div style={{ color: label.colour }} data-testid="labelIcon">
                <FontAwesomeIcon alt={label.name} icon={'tag'} />
            </div>
            <button
                onClick={() => setFilter(label.id)}
                className={styles.labelName}
            >
                {label.name}
            </button>
            <span className={styles.labelCount}>{label.count}</span>
        </li>
    );
};

export default Label;
