import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, IconButton, Button, ListSubheader, Autocomplete, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context2/AuthContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const TutoringPreferencesLanguages = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
    const [errors, setErrors] = useState({});
    const {currentUser} = useContext(AuthContext);
    const [formData, setFormData] = useState({
        tutoringTypes: [],
        languages: [],
        travelDistance: '',
        assignmentHelp: false,
        user_id: '',

      });

      useEffect(() => {
        if (currentUser?.user.id) {
          axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/fetchTutorPreferences/${currentUser?.user.id}`)
            .then(res => {
              if (res.data && res.data.length > 0) {
                setFormData({
                  tutoringTypes: res.data[0].tutoring_preferences ? JSON.parse(res.data[0].tutoring_preferences) : [],
                  languages: res.data[0].language_preferences ? JSON.parse(res.data[0].language_preferences) : [],
                  travelDistance: res.data[0].travel_distance || '',
                  assignmentHelp: res.data[0].can_do_assignmnet === 'true' || res.data[0].can_do_assignmnet === true,
                  user_id: currentUser?.user.id
                });
              }
            })
            .catch(err => {
              console.error('Error fetching tutor preferences:', err);
            });
        }
      }, [currentUser?.user.id]);


    const tutoringOptions = [
        'Online (using Zoom etc)',
        'At my place (home/institute)',
        'Travel to student'
      ];
      
      const indianLanguages = [
        "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati", "Kannada",
        "Malayalam", "Odia", "Punjabi", "Assamese", "Maithili", "Sanskrit"
      ];
      
      
      
 

      const handleMultiSelectChange = (name, value) => {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const handleSubmit = async () => {
        formData.user_id = currentUser?.user.id;
        await axios.put(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addTutorPreferences`, formData)
          .then(res => {
            console.log(res);
            toast.success('Tutor preferences added successfully');
            handleNextStep();
          })
          .catch(err => {
            console.log(err);
            toast.error('Failed to add tutor preferences');
          })
      }
  return (
    <div className={`section-content-animated${showStep == 8 ? ' open' : ''}`}>
          <div className="row">
            <div className="input-wrapper col-md-6">
              <Autocomplete
                multiple
                options={tutoringOptions}
                value={formData.tutoringTypes}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    tutoringTypes: newValue
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tutoring Preferences"
                    error={!!errors.tutoringTypes}
                    helperText={errors.tutoringTypes || "Select one or more tutoring types"}
                    className="input-field"
                  />
                )}
              />

            </div>
            <div className="input-wrapper col-md-6">
              <Autocomplete
                multiple
                options={indianLanguages}
                value={formData.languages}
                onChange={(event, newValue) => {
                  handleMultiSelectChange('languages', newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Preferred Languages"
                    placeholder="Select languages"
                    error={!!errors.languages}
                    helperText={errors.languages}
                    className="input-field"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
              />
            </div>
            {formData.tutoringTypes && formData.tutoringTypes.includes('Travel to student') && (
              <div className="input-wrapper col-md-6">
                <TextField
                  label="Maximum distance you can travel (in km)"
                  type="number"
                  value={formData.travelDistance || ''}
                  onChange={e => setFormData(prev => ({ ...prev, travelDistance: e.target.value }))}
                  className="input-field"
                  inputProps={{ min: 1, max: 50 }}
                  required
                  fullWidth
                />
              </div>
            )}
            <div>
              <FormControlLabel
                control={<Checkbox checked={formData.assignmentHelp || false} onChange={e => setFormData(prev => ({ ...prev, assignmentHelp: e.target.checked }))} />}
                label="I want to help with assignments/homework"
                sx={{ mt: 2 }}
              />
            </div>
          </div>
          <div className="step-btn-group">
            <Button variant="contained" className="save-next-btn" onClick={handleSubmit}>Save</Button>
            {/* <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button> */}
          </div>
        </div>
  )
}

export default TutoringPreferencesLanguages