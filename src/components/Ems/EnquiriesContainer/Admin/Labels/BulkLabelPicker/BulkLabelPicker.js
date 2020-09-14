import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import OptionPicker from '../../../../../UI/OptionPicker/OptionPicker';
import { toggleLabelBulk } from '../../../../../../store/queries/queriesActions';

const LabelPicker = ({ disabled }) => {
    const { labelList } = useSelector((state) => state.labels);
    const { queryList, selected } = useSelector((state) => state.queries);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const options = labelList.map((label) => ({
        id: label.id,
        label: label.name,
        colour: label.colour
    }));

    // We need an array of "selected" label IDs, in this case it is
    // labels that are attached to *all* the *selected* queries
    const selectedQueries = queryList.filter((query) =>
        selected.includes(query.id)
    );
    const attachedToAll = labelList
        .filter((label) =>
            selectedQueries.every((query) => query.labels.includes(label.id))
        )
        .map((filtered) => filtered.id);

    // Pass the label that is being toggled, its currently selected
    // status and the queries the change affects
    const dispatchBulkLabel = (labelId) => {
        const isSelected = attachedToAll.includes(labelId);
        dispatch(
            toggleLabelBulk({
                labelId,
                isSelected,
                affectedQueries: selected
            })
        );
    };

    return (
        <OptionPicker
            button={{
                label: t('Add or remove labels'),
                icon: 'tag',
                disabled
            }}
            selected={attachedToAll}
            options={options}
            shouldClose={false}
            onChoose={(labelId) => dispatchBulkLabel(labelId)}
        ></OptionPicker>
    );
};

LabelPicker.propTypes = {
    disabled: PropTypes.bool.isRequired
};

export default LabelPicker;
