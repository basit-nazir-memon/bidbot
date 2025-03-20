import React from 'react';
import { useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import SoftTypography from "components/SoftTypography";
import DeleteIcon from '@mui/icons-material/Delete'; // Import the Delete icon

import SoftButton from "components/SoftButton";

const DropArea = ({ customComponents, deleteComponent }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: () => ({ name: 'DropArea' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        padding: '20px',
        border: '2px dashed #ccc',
        height: '400px',
        width: '100%',
        borderRadius: '20px',
        backgroundColor: isOver ? '#f0f8ff' : 'white',
      }}
    >
      {customComponents.length === 0 ? (
        <SoftTypography variant="button" fontWeight="regular" color="text">
          Select and Drop Components Here
        </SoftTypography>
      ) : (
        customComponents.map((component, index) => (
          <div key={index} style={{ padding: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            
            <SoftButton 
              size="small"
              variant="gradient" // Changed to outlined for better visibility
              color="info"
              style={{ marginLeft: '10px', cursor: 'pointer', padding: '0px 30px' }}
              
              onClick={() => deleteComponent(index)}
              fullWidth
            >
                {component}
            </SoftButton>
            <SoftButton 
              size="small"
              variant="outlined" // Changed to outlined for better visibility
              color="error"
              style={{ marginLeft: '10px', cursor: 'pointer', padding: '0px' }}
              onClick={() => deleteComponent(index)}
              iconOnly={true}
            >
              <DeleteIcon style={{ fontSize: '16px', margin: "0px" }} /> {/* Use Delete icon */}
            </SoftButton>
          </div>
        ))
      )}
    </div>
  );
};

DropArea.propTypes = {
  customComponents: PropTypes.arrayOf(PropTypes.string).isRequired,
  deleteComponent: PropTypes.func.isRequired,
};

export default DropArea;
