import React from 'react'
import { Typography, TextField, Button, CircularProgress } from '@mui/material';  
import { useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context2/AuthContext';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
const IntroductionVideo = ({showStep, setShowStep, handleNextStep, handleSkipStep}) => {
    const [errors, setErrors] = useState({});
    const [introVideo, setIntroVideo] = useState(
      {
        url: '',
        user_id: ''
      }
    );
    const {currentUser} = useContext(AuthContext);
    useEffect(() => {
      axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/fetchVideoInfo/${currentUser?.user.id}`)
        .then(res => {
            setIntroVideo({url: res.data[0].intro_video_url});
        })
    }, [showStep, currentUser]);
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

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    //console.log(introVideo);
    introVideo.user_id = currentUser?.user.id;
    
    await axios.put(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addVideoInfo`, introVideo )
      .then(res => {
       // console.log(res);
        toast.success('Video added successfully');
        handleNextStep();
      })
      .catch(err => {
       // console.log(err);
        toast.error('Failed to add video');
      })
  }

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
    <div className="input-wrapper col-md-8 mt-3">
      <TextField fullWidth label="Your Introduction Video YouTube URL (optional)" name="introVideoUrl" value={introVideo.url} onChange={e => setIntroVideo({ ...introVideo, url: e.target.value })} error={!!errors.introVideo} helperText={errors.introVideo} className="input-field" />
    </div>
    <div className="step-btn-group">
      <Button variant="contained" className="save-next-btn" onClick={handleSubmit}>Save & Next</Button>
      <Button variant="outlined" className="skip-btn" onClick={handleSkipStep}>Skip</Button>
    </div>
  </div>

  )
}

export default IntroductionVideo