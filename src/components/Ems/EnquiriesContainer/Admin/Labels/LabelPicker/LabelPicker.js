import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { toggleLabel } from '../../../../../../store/queries/queriesActions';
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
        dispatch(toggleLabel({ query, labelId }));
    };

    return (
        <OptionPicker
            button={{
                label: t('Add or remove labels'),
                icon: 'pencil-alt'
            }}
            promptText={t('Add labels')}
            selected={query.labels}
            options={options}
            shouldClose={false}
            onChoose={(payload) => dispatchToggle(payload)}
        ></OptionPicker>
    );
};

LabelPicker.propTypes = {
    query: PropTypes.object.isRequired
};

export default LabelPicker;
