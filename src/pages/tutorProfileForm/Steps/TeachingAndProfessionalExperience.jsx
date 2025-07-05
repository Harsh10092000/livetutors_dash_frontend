import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, IconButton, Button, ListSubheader } from '@mui/material';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { AuthContext } from '../../../context2/AuthContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
const TeachingAndProfessionalExperience = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useContext(AuthContext);
      // Add state for extra experience questions
  const [overallTeachingExp, setOverallTeachingExp] = useState('');
  const [hasOnlineExp, setHasOnlineExp] = useState('no');
  const [onlineExpYears, setOnlineExpYears] = useState('');

  const currentYear = new Date().getFullYear();

    // Add state for professional/teaching experience
    const [profExp, setProfExp] = useState([
        { org: '', designation: '', startMonth: '', startYear: '', endMonth: '', endYear: '', association: '', roles: '' }
      ]);
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const assocOptions = ['Full-time', 'Part-time', 'Visiting', 'Freelance', 'Internship', 'Other'];
      const expYears = Array.from({ length: 60 }, (_, i) => (currentYear - i).toString());

    // Add handlers for profExp
    const handleProfExpChange = (idx, field, value) => {
        setProfExp(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
      };
      const handleAddProfExp = () => {
        setProfExp(prev => [...prev, { org: '', designation: '', startMonth: '', startYear: '', endMonth: '', endYear: '', association: '', roles: '' }]);
      };
      const handleRemoveProfExp = (idx) => {
        setProfExp(prev => prev.filter((_, i) => i !== idx));
      };

      useEffect(() => {
        if (currentUser?.user.id) {
          setIsLoading(true);
          axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/fetchTeachingExperience/${currentUser?.user.id}`)
            .then(res => {
              if (res.data && res.data.length > 0) {
                setOverallTeachingExp(res.data[0].total_exp_yrs || '');
                setHasOnlineExp(res.data[0].online_exp || 'no');
                setOnlineExpYears(res.data[0].total_online_exp_yrs || '');
              }
            })
            .catch(err => {
              console.error('Error fetching teaching experience:', err);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }, [currentUser?.user.id]);

      useEffect(() => {
        if (currentUser?.user.id) {
          axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/fetchTutorExperience/${currentUser?.user.id}`)
            .then(res => {
              setProfExp(res.data.map(exp => ({
                org: exp.company,
                designation: exp.role,
                startMonth: exp.start_month,
                startYear: exp.start_year,
                endMonth: exp.end_month,
                endYear: exp.end_year,
                association: exp.association,
                roles: exp.description
              })));
            })
            .catch(err => {
              console.error('Error fetching tutor experience:', err);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }, [currentUser?.user.id]);

      const handleSubmit = async () => {
        setIsSubmitting(true);
        const loadingToast = toast.loading('Saving teaching experience...');
        
        try {
          // First, update the teaching experience in tutor_info table
          await axios.put(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addTeachingExperience`, {
            totalExpYrs: overallTeachingExp,
            onlineExp: hasOnlineExp,
            totalOnlineExpYrs: onlineExpYears,
            user_id: currentUser?.user.id
          });

          // Then, handle professional experience entries
          if (profExp.length > 0 && profExp[0].org) {
            // Delete existing experience entries
            await axios.delete(`${import.meta.env.VITE_BACKEND}/api/becameTutor/deleteTutorExperience/${currentUser?.user.id}`);
            
            // Add new experience entries
            const experienceData = profExp
              .filter(exp => exp.org && exp.designation) // Only add if organization and designation are filled
              .map(exp => ({
                company: exp.org,
                role: exp.designation,
                start_month: exp.startMonth,
                start_year: exp.startYear,
                end_month: exp.endMonth,
                end_year: exp.endYear,
                description: exp.roles,
                user_id: currentUser?.user.id
              }));

            if (experienceData.length > 0) {
              await axios.post(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addTutorExperience`, experienceData);
            }
          }

          toast.dismiss(loadingToast);
          toast.success('Teaching experience added successfully');
          handleNextStep();
        } catch (err) {
          toast.dismiss(loadingToast);
          console.error('Error submitting teaching experience:', err);
          toast.error('Failed to add teaching experience');
        } finally {
          setIsSubmitting(false);
        }
      }

  if (isLoading) {
    return (
      <div className={`section-content-animated${showStep == 6 ? ' open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div>Loading existing data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`section-content-animated${showStep == 6 ? ' open' : ''}`}>
    <div className="row">
      <div className="input-wrapper col-md-4">
        <TextField
          label="Overall teaching experience (in years)"
          type="number"
          value={overallTeachingExp}
          onChange={e => setOverallTeachingExp(e.target.value)}
          className="input-field"
          inputProps={{ min: 0 }}
          fullWidth
        />
      </div>
      <div className="input-wrapper col-md-4">
        <FormControl fullWidth>
          <InputLabel>Do you have online teaching experience?</InputLabel>
          <Select
            value={hasOnlineExp}
            label="Do you have online teaching experience?"
            onChange={e => setHasOnlineExp(e.target.value)}
            className="input-field"
          >
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
          </Select>
        </FormControl>
      </div>
      {hasOnlineExp === 'yes' && (
        <div className="input-wrapper col-md-4">
          <TextField
            label="How many years of online experience?"
            type="number"
            value={onlineExpYears}
            onChange={e => setOnlineExpYears(e.target.value)}
            className="input-field"
            inputProps={{ min: 0 }}
            fullWidth
          />
        </div>
      )}
    </div>
    {profExp.map((row, idx) => (
      <div style={{ border: '1px solid #ccc', padding: 15, borderRadius: 10, marginBottom: 15 }} key={idx}>
        <div className="prof-exp-row" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <TextField
            label="Organization name with city"
            value={row.org}
            onChange={e => handleProfExpChange(idx, 'org', e.target.value)}
            className="input-field"
            sx={{ width: '100%' }}
          />
          <TextField
            label="Designation"
            value={row.designation}
            onChange={e => handleProfExpChange(idx, 'designation', e.target.value)}
            className="input-field"
            sx={{ width: '100%' }}
          />
          {profExp.length > 1 && (
            <IconButton onClick={() => handleRemoveProfExp(idx)} aria-label="Remove experience" color="error">
              <CloseIcon />
            </IconButton>
          )}
        </div>
        <div className="input-wrapper col-md-12 d-flex gap-2">
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>Start Month</InputLabel>
            <Select
              value={row.startMonth}
              label="Start Month"
              onChange={e => handleProfExpChange(idx, 'startMonth', e.target.value)}
              className="input-field"
            >
              {months.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>Start Year</InputLabel>
            <Select
              value={row.startYear}
              label="Start Year"
              onChange={e => handleProfExpChange(idx, 'startYear', e.target.value)}
              className="input-field"
            >
              {expYears.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>End Month</InputLabel>
            <Select
              value={row.endMonth}
              label="End Month"
              onChange={e => handleProfExpChange(idx, 'endMonth', e.target.value)}
              className="input-field"
            >
              <MenuItem value="">(Still working)</MenuItem>
              {months.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>End Year</InputLabel>
            <Select
              value={row.endYear}
              label="End Year"
              onChange={e => handleProfExpChange(idx, 'endYear', e.target.value)}
              className="input-field"
            >
              <MenuItem value="">(Still working)</MenuItem>
              {expYears.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>Association</InputLabel>
            <Select
              value={row.association}
              label="Association"
              onChange={e => handleProfExpChange(idx, 'association', e.target.value)}
              className="input-field"
            >
              {assocOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div className="input-wrapper col-md-12" style={{ marginTop: '15px', marginBottom: '0' }}>
          <TextField
            label="Your Roles and Responsibilities at this job"
            value={row.roles}
            onChange={e => handleProfExpChange(idx, 'roles', e.target.value)}
            className="input-field"
            sx={{ width: '100%' }}
            multiline
            rows={2}
          />
        </div>
      </div>
    ))}
    <Button startIcon={<AddIcon />} onClick={handleAddProfExp} variant="outlined" sx={{ mt: 1 }}>Add new</Button>
    <div className="step-btn-group">
      <Button 
        variant="contained" 
        className="save-next-btn" 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save & Next'}
      </Button>
      <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
    </div>
  </div>
  )
}

export default TeachingAndProfessionalExperience