import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Chip,
  Autocomplete,
  FormHelperText,
  Input,
  Avatar,
  ListSubheader,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  LocationOn,
  Phone,
  School,
  Person,
  Language,
  AccessTime,
  Description,
  Edit,
  Close as CloseIcon,
  CloudUpload,
  AttachFile,
  InsertDriveFile,
  KeyboardArrowDown,
  PhotoCamera,
  Delete,
  Add as AddIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context2/AuthContext';
import '../../pages/form.css';
import BasicInformation from './Steps/BasicInformation';
import IntroductionVideo from './Steps/IntroductionVideo';
import SkillsAndExpertise from './Steps/SkillsAndExpertise';
import AddressSection from './Steps/AddressSection';
import EducationDetails from './Steps/EducationDetails.JSX';
import TeachingAndProfessionalExperience from './Steps/TeachingAndProfessionalExperience';
import FeeDetails from './Steps/FeeDetails';
import TutoringPreferencesLanguages from './Steps/TutoringPreferencesLanguages';

// Function to generate random 7-digit ID
const generateRequestId = () => {
  return 'RT-' + Math.floor(1000000 + Math.random() * 9000000);
};

// Function to generate URL-friendly string
const generateUrlString = (city, subject, tutoringType) => {
  const typeMap = {
    'Online (using Zoom etc)': 'online',
    'At my place (home/institute)': 'home',
    'Travel to student': 'travel'
  };

  const type = typeMap[tutoringType] || 'tutor';
  const urlString = `${type}-${subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-teacher-required-in-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return urlString;
};



const TutorProfileForm = () => {

  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    requestId: generateRequestId(),
    urlString: '',
    streetAddress: '',
    state: null,
    city: null,
    genderPreference: '',
    subjects: [],
    studentLevel: '',
    tutoringTypes: [],
    travelDistance: '',
    budget: '',
    timePreferenceType: '',
    timePreference: '',
    languages: [],
    requirementDetails: '',
    uploadedFiles: [],
    user_id: currentUser?.user.id,
    name: currentUser?.user.name,
    email: currentUser?.user.email,
    phone: currentUser?.user.phone
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();




  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      formData.uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);



  useEffect(() => {
    // Generate URL string when relevant fields change
    if (formData.city && formData.subjects && formData.tutoringTypes.length > 0) {
      const url = generateUrlString(
        formData.city.city_name,
        formData.subjects.join(','),
        formData.tutoringTypes[0]
      );
      setFormData(prev => ({ ...prev, urlString: url }));
    }
  }, [formData.city, formData.subjects, formData.tutoringTypes]);


  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Address validation
    if (!formData.streetAddress.trim()) {
      tempErrors.streetAddress = 'Street address is required';
      isValid = false;
    }

    if (!formData.state) {
      tempErrors.state = 'State is required';
      isValid = false;
    }

    if (!formData.city) {
      tempErrors.city = 'City is required';
      isValid = false;
    }


    // Subject validation
    const subjectRegex = /^[a-zA-Z\s,]+$/;
    if (!formData.subjects.join(',').trim()) {
      tempErrors.subjects = 'Subject(s) is required';
      isValid = false;
    } else if (!subjectRegex.test(formData.subjects.join(','))) {
      tempErrors.subjects = 'Only letters, spaces and commas allowed';
      isValid = false;
    }

    // Tutoring type validation
    if (formData.tutoringTypes.length === 0) {
      tempErrors.tutoringTypes = 'Please select a tutoring type';
      isValid = false;
    }

    // Travel distance validation for "Travel to student" option
    if (formData.tutoringTypes.includes('Travel to student')) {
      if (!formData.travelDistance) {
        tempErrors.travelDistance = 'Travel distance is required';
        isValid = false;
      } else if (formData.travelDistance < 1 || formData.travelDistance > 50) {
        tempErrors.travelDistance = 'Distance should be between 1-50 km';
        isValid = false;
      }
    }

    // Budget validation
    if (formData.budget && (isNaN(formData.budget) || formData.budget < 100)) {
      tempErrors.budget = 'Minimum budget should be ₹100';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'uploadedFiles') {
          formData[key].forEach(fileObj => {
            formDataToSend.append('files', fileObj.file);
          });
        } else if (key === 'subjects' || key === 'tutoringTypes') {
          // Join arrays with commas for backend storage
          formDataToSend.append(key, formData[key].join(','));
        } else if (key === 'state' && formData[key]) {
          formDataToSend.append('state', formData[key].state_name);
        } else if (key === 'city' && formData[key]) {
          formDataToSend.append('city', formData[key].city_name);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post('http://localhost:8010/api/tutor/submitrequesttutor', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Tutor request submitted successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Error submitting form');
    }
  };

  const [showStep, setShowStep] = useState(1);

  const handleStepChange = (val) => {
    setShowStep(showStep == val ? 0 : val);
  };



  // Add a helper to determine last step
  const LAST_STEP = 8;

  // Add handlers for Save, Skip, Next
  const handleNextStep = async (e) => {
    if (showStep === 1) {
      if (validateForm()) setShowStep(2);
      else toast.error('Please fix errors before continuing.');
      //setShowStep(2);
      // else toast.error('Please fix errors before continuing.');
    } else if (showStep < LAST_STEP) {
      setShowStep(showStep + 1);
      //else toast.error('Please fix errors before continuing.');
    }
    // else if (showStep === 2) {
       //setShowStep(3);
      //else toast.error('Please fix errors before continuing.');
   // } else if (showStep < LAST_STEP) {
      //if () setShowStep(showStep + 1);
      //else toast.error('Please fix errors before continuing.');

  };
  const handleSkipStep = () => {
    if (showStep === 2) setShowStep(3);
    else if (showStep < LAST_STEP) setShowStep(showStep + 1);
  };


  return (
    <div className="tutor-request-wrapper">
      <div className="tutor-request-container">
        {/* <div className="form-title">Request a Tutor</div> */}

        {/* Step 1: Basic Info */}
        <div onClick={() => handleStepChange(1)} className={`section-title cursor-pointer not-selected ${showStep == 1 ? 'selected' : ''}`}>
          <Person /> Basic Information
          <KeyboardArrowDown className={`chevron-icon${showStep == 1 ? ' open' : ''}`} />
        </div>
        <BasicInformation showStep={showStep} setShowStep={setShowStep} handleNextStep={handleNextStep} />

        {/* Step 2: Introduction Video */}
        <div onClick={() => handleStepChange(2)} className={`section-title cursor-pointer not-selected ${showStep == 2 ? 'selected' : ''}`}>
          <InsertDriveFile /> Introduction Video
          <KeyboardArrowDown className={`chevron-icon${showStep == 2 ? ' open' : ''}`} />
        </div>
        <IntroductionVideo showStep={showStep} setShowStep={setShowStep} handleNextStep={handleNextStep} handleSkipStep={handleSkipStep} />
        {/* Step 3: Skills and Expertise */}
        <div onClick={() => handleStepChange(3)} className={`section-title cursor-pointer not-selected ${showStep == 3 ? 'selected' : ''}`}>
          <School /> Skills and Expertise
          <KeyboardArrowDown className={`chevron-icon${showStep == 3 ? ' open' : ''}`} />
        </div>
        <SkillsAndExpertise showStep={showStep} setShowStep={setShowStep} handleNextStep={handleNextStep} handleSkipStep={handleSkipStep} />
       

        {/* Address Section */}
        <div onClick={() => handleStepChange(4)} className={`section-title cursor-pointer not-selected ${showStep == 4 ? 'selected' : ''}`}>
          <LocationOn /> Address Information
          <KeyboardArrowDown className={`chevron-icon${showStep == 4 ? ' open' : ''}`} />
        </div>
       <AddressSection showStep={showStep} setShowStep={setShowStep} handleNextStep={handleNextStep} handleSkipStep={handleSkipStep} />



        {/* Education Details */}
        <div onClick={() => handleStepChange(5)} className={`section-title cursor-pointer not-selected ${showStep == 5 ? 'selected' : ''}`}>
          <School /> Education Details
          <KeyboardArrowDown className={`chevron-icon${showStep == 5 ? ' open' : ''}`} />
        </div>
       <EducationDetails showStep={showStep} setShowStep={setShowStep} handleNextStep={handleNextStep} handleSkipStep={handleSkipStep} />

        {/* Teaching and Professional Experience */}
        <div onClick={() => handleStepChange(6)} className={`section-title cursor-pointer not-selected ${showStep == 6 ? 'selected' : ''}`}>
          <School /> Teaching and Professional Experience
          <KeyboardArrowDown className={`chevron-icon${showStep == 6 ? ' open' : ''}`} />
        </div>
        <TeachingAndProfessionalExperience showStep={showStep} setShowStep={setShowStep} handleNextStep={handleNextStep} handleSkipStep={handleSkipStep} />

        {/* Fee Details */}
        <div onClick={() => handleStepChange(7)} className={`section-title cursor-pointer not-selected ${showStep == 7 ? 'selected' : ''}`}>
          <AttachFile /> Fee Details
          <KeyboardArrowDown className={`chevron-icon${showStep == 7 ? ' open' : ''}`} />
        </div>
      <FeeDetails showStep={showStep} setShowStep={setShowStep} handleNextStep={handleNextStep} handleSkipStep={handleSkipStep} />

        {/* Tutoring Preferences & Languages */}
        <div onClick={() => handleStepChange(8)} className={`section-title cursor-pointer not-selected ${showStep == 8 ? 'selected' : ''}`}>
          <AccessTime /> Tutoring Preferences & Languages
          <KeyboardArrowDown className={`chevron-icon${showStep == 8 ? ' open' : ''}`} />
        </div>
        <TutoringPreferencesLanguages showStep={showStep} setShowStep={setShowStep} handleNextStep={handleNextStep} handleSkipStep={handleSkipStep} />


      </div>
    </div>
  );
};

export default TutorProfileForm; 