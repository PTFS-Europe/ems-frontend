import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { toggleLabelBulk } from '../../../../../../store/queries/queriesActions';
import OptionPicker from '../../../../../UI/OptionPicker/OptionPicker';

const LabelPicker = ({ query }) => {
    const stateLabels = useSelector((state) => state.labels);

    const dispatch = useDispatch();

    const options = stateLabels.labelList.map((label) => ({
        id: label.id,
        label: label.name,
        colour: label.colour
    }));

    const { t } = useTranslation();

    const dispatchToggle = (labelId) => {
        dispatch(
            toggleLabelBulk({
                labelId,
                isSelected: query.labels.includes(labelId),
                affectedQueries: [query.id]
            })
        );
    };

    return (
        <OptionPicker
            button={{
                label: t('Add or remove labels'),
                icon: 'tag'
            }}
            selected={query.labels}
            options={options}
            shouldClose={false}
            onChoose={(labelId) => dispatchToggle(labelId)}
        ></OptionPicker>
    );
};

LabelPicker.propTypes = {
    query: PropTypes.object.isRequired
};

export default LabelPicker;
