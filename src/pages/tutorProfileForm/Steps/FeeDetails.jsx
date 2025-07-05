import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context2/AuthContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const FeeDetails = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
  // Add state for fee details
  const [feeDetails, setFeeDetails] = useState({ fee_charged_for: '', fee_max: '', fee_min: '', fee_details: '', user_id: '' });
  const chargeTypes = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Per Assignment'];
  const {currentUser} = useContext(AuthContext);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/fetchFeeInfo/${currentUser?.user.id}`)
      .then(res => {
        setFeeDetails({
          fee_charged_for: res.data[0].fee_charged_for || '',
          fee_max: res.data[0].fee_max || '',
          fee_min: res.data[0].fee_min || '',
          fee_details: res.data[0].fee_details || ''
        });
      })
  }, [currentUser]);

  const handleSubmit = async () => {
    feeDetails.user_id = currentUser?.user.id;
    await axios.put(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addFeeInfo`, feeDetails)
      .then(res => {
        console.log(res);
        toast.success('Fee details added successfully');
        handleNextStep();
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to add fee details');
      })
  }

  return (
    <div className={`section-content-animated${showStep == 7 ? ' open' : ''}`}>
    <div className="row">
      <div className="input-wrapper col-md-4">
        <FormControl fullWidth>
          <InputLabel>I charge</InputLabel>
          <Select
            value={feeDetails.fee_charged_for}
            label="I charge"
            onChange={e => setFeeDetails(prev => ({ ...prev, fee_charged_for: e.target.value }))}
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
          value={feeDetails.fee_min}
          onChange={e => setFeeDetails(prev => ({ ...prev, fee_min: e.target.value }))}
          className="input-field"
          inputProps={{ min: 0 }}
          fullWidth
        />
      </div>
      <div className="input-wrapper col-md-4">
        <TextField
          label="Maximum fee"
          type="number"
          value={feeDetails.fee_max}
          onChange={e => setFeeDetails(prev => ({ ...prev, fee_max: e.target.value }))}
          className="input-field"
          inputProps={{ min: 0 }}
          fullWidth
        />
      </div>
    </div>
    <div className="input-wrapper col-md-12">
      <TextField
        label="Fee Details (Details of how fee can vary)"
        value={feeDetails.fee_details}
        onChange={e => setFeeDetails(prev => ({ ...prev, fee_details: e.target.value }))}
        className="input-field"
        fullWidth
        multiline
        rows={3}
      />
    </div>
    <div className="step-btn-group">
      <Button variant="contained" className="save-next-btn" onClick={handleSubmit}>Save & Next</Button>
      <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
    </div>
  </div>

  )
}

export default FeeDetails