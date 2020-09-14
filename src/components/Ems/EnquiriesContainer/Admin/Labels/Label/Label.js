import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setLabelsFilter } from '../../../../../../store/labels/labelsActions';

import styles from './Label.module.scss';

const Label = ({ label, stateLabels }) => {
    // Enable us to dispatch
    const dispatch = useDispatch();

    // Make the state we need available
    const stateLabelsCounts = useSelector((state) => state.labels.labelsCounts);

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
            onClick={() => setFilter(label.id)}
            key={label.id}
            className={`${styles.label} ${isSelected(label.id)}`}
        >
            <div style={{ color: label.colour }} data-testid="labelIcon">
                <FontAwesomeIcon alt={label.name} icon={'tag'} />
            </div>
            <button className={styles.labelName}>{label.name}</button>
            <span className={styles.labelCount}>
                {stateLabelsCounts[label.id] || 0}
            </span>
        </li>
    );
};

Label.propTypes = {
    label: PropTypes.object.isRequired,
    stateLabels: PropTypes.object.isRequired
};

export default Label;
