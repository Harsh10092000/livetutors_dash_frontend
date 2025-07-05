import React from 'react'
import { Typography, TextField, Button } from '@mui/material';  
import { useState } from 'react';

const IntroductionVideo = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
    const [errors, setErrors] = useState({});
    const [introVideo, setIntroVideo] = useState({ url: '' });

    const validateStep2 = () => {
        if (!introVideo.url) return true; // optional
        // Validate YouTube URL
        const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!ytRegex.test(introVideo.url)) {
          setErrors({ introVideo: 'Enter a valid YouTube URL' });
          return false;
        }
        setErrors({});
        return true;
      };

  return (
    <div className={`section-content-animated${showStep == 2 ? ' open' : ''}`}>
    <div className="intro-video-instructions">
      <Typography variant="subtitle1" gutterBottom>
        <b>Introduction Video</b>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Students find teachers with intro videos more trustworthy. Intro videos are an opportunity to showcase your skills and stand out from the crowd.<br />
        <b>What to include:</b> Your name, location, subjects/skills, languages, qualifications, what students can expect, activities/materials, and a positive ending.<br />
        <b>Do:</b> Record in landscape, well-lit room, clear audio, max 3 min, 100+ word YouTube description.<br />
        <b>Do not:</b> Mention contact details, use filters, show others, use slideshows, include logos/links.
      </Typography>
    </div>
    <div className="input-wrapper col-md-8">
      <TextField fullWidth label="Your Introduction Video YouTube URL (optional)" name="introVideoUrl" value={introVideo.url} onChange={e => setIntroVideo({ url: e.target.value })} error={!!errors.introVideo} helperText={errors.introVideo} className="input-field" />
    </div>
    <div className="step-btn-group">
      <Button variant="contained" className="save-next-btn" onClick={handleNextStep}>Save & Next</Button>
      <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
    </div>
  </div>

  )
}

export default IntroductionVideo