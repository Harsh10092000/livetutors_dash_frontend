import React from 'react'
import { Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, IconButton, Button, ListSubheader } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { AuthContext } from '../../../context2/AuthContext';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
const SkillsAndExpertise = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
    const [errors, setErrors] = useState({});
    const {currentUser} = useContext(AuthContext);
    const [skills, setSkills] = useState([{ skill: '', from: '', to: '' }]);

    useEffect(() => {
      if (currentUser?.user.id) {
        axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/fetchSkillsInfo/${currentUser?.user.id}`)
          .then(res => {  
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
              setSkills(res.data.map(skill => ({
                skill: skill.skill_name,
                from: skill.from_level,
                to: skill.to_level
              })));
            } else {
              // If no skills found, keep the default empty skill row
              setSkills([{ skill: '', from: '', to: '' }]);
            }
          })
          .catch(err => {
            console.error('Error fetching skills:', err);
            // Keep default state on error
            setSkills([{ skill: '', from: '', to: '' }]);
          });
      }
    }, [currentUser?.user.id]);
      // Add state for skills
  console.log(skills);
  const skillOptions = [
    'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'Data Science', 'Machine Learning', 'Public Speaking', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'History', 'Geography', 'Art', 'Music', 'Dance', 'Yoga', 'Digital Marketing', 'Web Development', 'Programming', 'Accounting', 'Business Studies', 'UPSC', 'IIT-JEE', 'NEET', 'CAT', 'GATE'
  ];


  const levelGroups = [
    { label: '-- Skill Level --', options: ['Beginner', 'Intermediate', 'Expert'] },
    {
      label: '-- Grades --', options: [
        'Pre-KG, Nursery', 'Kindergarten (KG)',
        ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)
      ]
    },
    {
      label: '-- College/University --', options: [
        'IGCSE', 'GCSE', 'O level', 'Grade 11', 'AS level', 'A2 level', 'A level', 'Grade 12',
        'Diploma', 'Bachelors/Undergraduate', 'Masters/Postgraduate', 'MPhil', 'Doctorate/PhD'
      ]
    }
  ];

  // Flatten all level options for easy indexing
  const flatLevels = [
    ...levelGroups[0].options,
    ...levelGroups[1].options,
    ...levelGroups[2].options
  ];

 const handleSkillChange = (idx, value) => {
    setSkills(prev => prev.map((row, i) => i === idx ? { ...row, skill: value } : row));
  };
  const handleFromChange = (idx, value) => {
    setSkills(prev => prev.map((row, i) => i === idx ? { ...row, from: value } : row));
  };
  const handleToChange = (idx, value) => {
    setSkills(prev => prev.map((row, i) => i === idx ? { ...row, to: value } : row));
  };
  const handleAddSkill = () => {
    setSkills(prev => [...prev, { skill: '', from: '', to: '' }]);
  };
  const handleRemoveSkill = (idx) => {
    setSkills(prev => prev.filter((_, i) => i !== idx));
  };

  const [skllsDeleted, setSkllsDeleted] = useState(false);

  const handleSubmit = async () => {
    //.log(skills);
    const skillsData = skills.map(skill => ({
      skill: skill.skill,
      from: skill.from,
      to: skill.to,
      user_id: currentUser?.user.id
    }));  
    //console.log(skillsData);
    await axios.delete(`${import.meta.env.VITE_BACKEND}/api/becameTutor/deleteSkillsInfo/${currentUser?.user.id}`)
      .then(async (res) => {
        //console.log(res);
        setSkllsDeleted(true);
        await axios.post(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addSkillsInfo`, skillsData)
      .then(res => {
        //console.log(res);
        toast.success('Skills Updated successfully');
        handleNextStep();
      })  
      .catch(err => {
        //console.log(err);
        toast.error('Failed to update skills');
      })
      })
      .catch(err => {
        console.log(err);
      })

     
  }

  return (
    <div className={`section-content-animated${showStep == 3 ? ' open' : ''}`}>
    {skills.map((row, idx) => {
      // Find index of selected 'from' level
      const fromIdx = flatLevels.indexOf(row.from);
      // Filtered options for 'to' level
      const toLevelGroups = levelGroups.map(group => ({
        label: group.label,
        options: fromIdx === -1 ? group.options : group.options.filter(opt => flatLevels.indexOf(opt) >= fromIdx)
      })).filter(group => group.options.length > 0); // Only keep groups with options
      return (
        <div className="skills-row" key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <Autocomplete
            freeSolo
            options={skillOptions}
            value={row.skill}
            onChange={(_, newValue) => handleSkillChange(idx, newValue || '')}
            onInputChange={(_, newInput) => handleSkillChange(idx, newInput)}
            renderInput={(params) => (
              <TextField {...params} label="Skill" placeholder="Type or select skill" className="input-field" style={{ minWidth: 140 }} />
            )}
            sx={{ flex: 2 }}
          />
          <FormControl sx={{ minWidth: 140, flex: 1 }}>
            <InputLabel>From Level</InputLabel>
            <Select
              value={row.from}
              label="From Level"
              onChange={e => handleFromChange(idx, e.target.value)}
              className="input-field"
              displayEmpty
            >
              <MenuItem value=""><em>-- Select Lowest Level --</em></MenuItem>
              {levelGroups.map(group => [
                <ListSubheader key={group.label}>{group.label}</ListSubheader>,
                group.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)
              ])}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 140, flex: 1 }}>
            <InputLabel>To Level</InputLabel>
            <Select
              value={row.to}
              label="To Level"
              onChange={e => handleToChange(idx, e.target.value)}
              className="input-field"
              displayEmpty
            >
              <MenuItem value=""><em>-- Select Highest Level --</em></MenuItem>
              {toLevelGroups.map(group => [
                <ListSubheader key={group.label}>{group.label}</ListSubheader>,
                group.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)
              ])}
            </Select>
          </FormControl>
          {skills.length > 1 && (
            <IconButton onClick={() => handleRemoveSkill(idx)} aria-label="Remove skill" color="error">
              <CloseIcon />
            </IconButton>
          )}
        </div>
      );
    })}
    <Button startIcon={<AddIcon />} onClick={handleAddSkill} variant="outlined" sx={{ mt: 1 }}>Add new</Button>
    <div className="step-btn-group">
      <Button variant="contained" className="save-next-btn" onClick={handleSubmit}>Save & Next</Button>
      <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
    </div>
  </div>
  )
}

export default SkillsAndExpertise