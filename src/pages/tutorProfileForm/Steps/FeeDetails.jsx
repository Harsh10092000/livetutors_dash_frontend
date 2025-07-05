import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useState } from 'react';


const FeeDetails = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
  // Add state for fee details
  const [feeDetails, setFeeDetails] = useState({ type: '', min: '', max: '', details: '' });
  const chargeTypes = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Per Assignment'];

  return (
    <div className={`section-content-animated${showStep == 7 ? ' open' : ''}`}>
    <div className="row">
      <div className="input-wrapper col-md-4">
        <FormControl fullWidth>
          <InputLabel>I charge</InputLabel>
          <Select
            value={feeDetails.type}
            label="I charge"
            onChange={e => setFeeDetails(prev => ({ ...prev, type: e.target.value }))}
            className="input-field"
          >
            {chargeTypes.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <div className="input-wrapper col-md-4">
        <TextField
          label="Minimum fee"
          type="number"
          value={feeDetails.min}
          onChange={e => setFeeDetails(prev => ({ ...prev, min: e.target.value }))}
          className="input-field"
          inputProps={{ min: 0 }}
          fullWidth
        />
      </div>
      <div className="input-wrapper col-md-4">
        <TextField
          label="Maximum fee"
          type="number"
          value={feeDetails.max}
          onChange={e => setFeeDetails(prev => ({ ...prev, max: e.target.value }))}
          className="input-field"
          inputProps={{ min: 0 }}
          fullWidth
        />
      </div>
    </div>
    <div className="input-wrapper col-md-12">
      <TextField
        label="Fee Details (Details of how fee can vary)"
        value={feeDetails.details}
        onChange={e => setFeeDetails(prev => ({ ...prev, details: e.target.value }))}
        className="input-field"
        fullWidth
        multiline
        rows={3}
      />
    </div>
    <div className="step-btn-group">
      <Button variant="contained" className="save-next-btn" onClick={handleNextStep}>Save & Next</Button>
      <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
    </div>
  </div>

  )
}

export default FeeDetails