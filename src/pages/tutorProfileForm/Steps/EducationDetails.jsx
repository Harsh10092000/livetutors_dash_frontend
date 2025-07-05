import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, IconButton, Button, ListSubheader } from '@mui/material';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { AuthContext } from '../../../context2/AuthContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
const EducationDetails = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
    const [errors, setErrors] = useState({});
    const {currentUser} = useContext(AuthContext);
    const [education, setEducation] = useState([]);
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/fetchEducationInfo/${currentUser?.user.id}`)
          .then(res => {
            setEducation(res.data.map(edu => ({
              degree: edu.degree_name,
              specialization: edu.speciality,
              institution: edu.university,
              year: edu.end_year,
              grade: edu.score
            })));
          })
    }, [showStep, currentUser]);

    // Add state for education details
  // const [education, setEducation] = useState([
  //   { degree: '', specialization: '', institution: '', year: '', grade: '' }
  // ]);
  
  const degreeOptions = [
    'High School', 'Diploma', 'Bachelors/Undergraduate', 'Masters/Postgraduate', 'MPhil', 'Doctorate/PhD', 'Other'
  ];

  
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 60 }, (_, i) => (currentYear - i).toString());
  

  
  const handleEduChange = (idx, field, value) => {
    setEducation(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };
  const handleAddEdu = () => {
    setEducation(prev => [...prev, { degree: '', specialization: '', institution: '', year: '', grade: '' }]);
  };
  const handleRemoveEdu = (idx) => {
    setEducation(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    console.log("education" ,education);
    await axios.delete(`${import.meta.env.VITE_BACKEND}/api/becameTutor/deleteEducationInfo/${currentUser?.user.id}`)
      .then(async (res) => {
        console.log(res);
        const educationData = education.map(edu => ({
          degree: edu.degree,
          specialization: edu.specialization,
          institution: edu.institution,
          year: edu.year,
          grade: edu.grade,
          user_id: currentUser?.user.id
        }));
        await axios.post(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addEducationInfo`, educationData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            console.log(res);
            toast.success('Education added successfully');
            handleNextStep();
          })
          .catch(err => {
            console.log(err);
            toast.error('Failed to add education');
          })
      })
      .catch(err => {
        console.log(err);
      })
    
  } 

  return (
    <div className={`section-content-animated${showStep == 5 ? ' open' : ''}`}>
          {education.map((row, idx) => (
            <div className="education-row" key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 140, flex: 1 }}>
                <InputLabel>Degree</InputLabel>
                <Select
                  value={row.degree}
                  label="Degree"
                  onChange={e => handleEduChange(idx, 'degree', e.target.value)}
                  className="input-field"
                >
                  {degreeOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Specialization/Subject"
                value={row.specialization}
                onChange={e => handleEduChange(idx, 'specialization', e.target.value)}
                className="input-field"
                sx={{ flex: 2, minWidth: 140 }}
              />
              <TextField
                label="Institution/University"
                value={row.institution}
                onChange={e => handleEduChange(idx, 'institution', e.target.value)}
                className="input-field"
                sx={{ flex: 2, minWidth: 140 }}
              />
              <FormControl sx={{ minWidth: 100, flex: 1 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={row.year}
                  label="Year"
                  onChange={e => handleEduChange(idx, 'year', e.target.value)}
                  className="input-field"
                >
                  {yearOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Grade/Percentage (optional)"
                value={row.grade}
                onChange={e => handleEduChange(idx, 'grade', e.target.value)}
                className="input-field"
                sx={{ flex: 1, minWidth: 100 }}
              />
              {education.length > 1 && (
                <IconButton onClick={() => handleRemoveEdu(idx)} aria-label="Remove education" color="error">
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddEdu} variant="outlined" sx={{ mt: 1 }}>Add new</Button>
          <div className="step-btn-group">
            <Button variant="contained" className="save-next-btn" onClick={handleSubmit}>Save & Next</Button>
            <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
          </div>
        </div>
  )
}

export default EducationDetails;