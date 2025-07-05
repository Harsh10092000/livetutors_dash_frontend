import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, IconButton, Button, ListSubheader } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const TeachingAndProfessionalExperience = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
    const [errors, setErrors] = useState({});

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
      <Button variant="contained" className="save-next-btn" onClick={handleNextStep}>Save & Next</Button>
      <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
    </div>
  </div>
  )
}

export default TeachingAndProfessionalExperience