import React from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import SoftButton from "components/SoftButton";

import { Select, MenuItem, Button } from "@mui/material";

const DraggableItem = ({ name, addComponent }) => {
  const [, drag] = useDrag(() => ({
    type: 'COMPONENT', // Ensure this matches the accept type in DropArea
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        addComponent(item.name); // Call the addComponent prop to add the component to DropArea
      }
    },
  }));

  return (
    
    <div ref={drag}>
      <SoftButton
        size="small"
        variant="gradient"
        color="info"
        fullWidth
        style={{ marginTop: "20px" }}
      >
        {name}
      </SoftButton>
    </div>
  );
};

DraggableItem.propTypes = {
  name: PropTypes.string.isRequired,
  addComponent: PropTypes.func.isRequired,
};

export default DraggableItem;
