import React from 'react'
import { TextField, Autocomplete, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { stateList, cityList } from '../../../data/locationData';
import axios from 'axios';
import { AuthContext } from '../../../context2/AuthContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
const AddressSection = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
    const [errors, setErrors] = useState({});
    const [filteredCities, setFilteredCities] = useState([]);
    const [formData, setFormData] = useState({
        streetAddress: '',
        state: '',
        city: '',
        user_id: ''
    });
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
      axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/fetchAddressInfo/${currentUser?.user.id}`)
        .then(res => {
          setFormData({
            streetAddress: res.data[0].street_add,
            state: stateList.find(state => state.name === res.data[0].state),
            city: cityList.find(city => city.city_name === res.data[0].city)
          });
        })
    }, [showStep, currentUser]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };

    const handleStateChange = (event, newValue) => {
        setFormData(prev => ({
          ...prev,
          state: newValue,
          city: null
        }));
      };
    
      const handleCityChange = (event, newValue) => {
        setFormData(prev => ({
          ...prev,
          city: newValue
        }));
      };

      useEffect(() => {
        if (formData.state) {
          const cities = cityList.filter(city => city.state_id === formData.state.id);
          setFilteredCities(cities);
        } else {
          setFilteredCities([]);
        }
      }, [formData.state]);
    
      const handleSubmit = async () => {
        formData.user_id = currentUser?.user.id;
        formData.state = formData.state.name;
        formData.city = formData.city.city_name;
        console.log(formData);
        await axios.put(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addAddressInfo`, formData)
          .then(res => {
            console.log(res);
            toast.success('Address updated successfully');
            handleNextStep();
          })
      }

  return (
    <div className={`section-content-animated${showStep == 4 ? ' open' : ''}`}>
    <div className="row">
      <div className="input-wrapper col-md-4">
        <TextField
          fullWidth
          label="Street Address"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          error={!!errors.streetAddress}
          helperText={errors.streetAddress}
          className="input-field"
        />
      </div>
      <div className="input-wrapper col-md-4">
        <Autocomplete
          options={stateList}
          value={formData.state}
          onChange={handleStateChange}
          getOptionLabel={(option) => option?.name || ''}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              error={!!errors.state}
              helperText={errors.state}
              className="input-field"
            />
          )}
        />
      </div>
      <div className="input-wrapper col-md-4">
        <Autocomplete
          options={filteredCities}
          value={formData.city}
          onChange={handleCityChange}
          getOptionLabel={(option) => option?.city_name || ''}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          disabled={!formData.state}
          renderInput={(params) => (
            <TextField
              {...params}
              label="City"
              error={!!errors.city}
              helperText={errors.city || (!formData.state ? 'Select state first' : '')}
              className="input-field"
            />
          )}
        />
      </div>
    </div>
    <div className="step-btn-group">
      <Button variant="contained" className="save-next-btn" onClick={handleSubmit}>Save & Next</Button>
      <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
    </div>
  </div>
  )
}

export default AddressSection