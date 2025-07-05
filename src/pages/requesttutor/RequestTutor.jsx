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
  Input
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
  InsertDriveFile
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { stateList, cityList } from '../../data/locationData';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context2/AuthContext';
import '../../pages/form.css';

// Function to generate random 7-digit ID
const generateRequestId = () => {
  return 'RT-' + Math.floor(1000000 + Math.random() * 9000000);
};

// Function to generate URL-friendly string
const generateUrlString = (city, subject, tutoringType) => {
  const typeMap = {
    'Online (using Zoom etc)': 'online',
    'At my place (home/institute)': 'home',
    'Travel to tutor': 'travel'
  };

  const type = typeMap[tutoringType] || 'tutor';
  const urlString = `${type}-${subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-teacher-required-in-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return urlString;
};

const tutoringOptions = [
  'Online (using Zoom etc)',
  'At my place (home/institute)',
  'Travel to tutor'
];

const indianLanguages = [
  "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati", "Kannada", 
  "Malayalam", "Odia", "Punjabi", "Assamese", "Maithili", "Sanskrit"
];

// Add common subjects list
const commonSubjects = [
  // Academic Subjects
  "Mathematics", "Physics", "Chemistry", "Biology", "Science",
  "English", "Hindi", "Social Studies", "History", "Geography",
  "Computer Science", "Programming", "Economics", "Accounting",
  // Professional Skills
  "Web Development", "Digital Marketing", "Business Studies",
  "Music", "Dance", "Art & Craft", "Yoga",
  // Test Preparation
  "UPSC", "IIT-JEE", "NEET", "CAT", "GATE"
];

const timePreferences = [
  { value: "fixed", label: "Fixed Time", subOptions: ["Morning", "Afternoon", "Evening", "Night"] },
  { value: "per_hour", label: "Per Hour" },
  { value: "per_day", label: "Per Day" },
  { value: "per_week", label: "Per Week" },
  { value: "per_month", label: "Per Month" }
];

const RequestTutor = () => {

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
  const [filteredCities, setFilteredCities] = useState([]);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    let newErrors = {};
    
    // Add all files to uploadedFiles, marking those with errors
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      hasError: file.size > maxSize,
      errorType: file.size > maxSize ? 'size' : null
    }));

    // Check for duplicates
    const nonDuplicates = newFiles.filter(newFile => 
      !formData.uploadedFiles.some(existingFile => 
        existingFile.file.name === newFile.file.name && 
        existingFile.file.size === newFile.file.size
      )
    );

    // Build error messages
    const oversizedFiles = nonDuplicates.filter(f => f.file.size > maxSize);
    if (oversizedFiles.length > 0) {
      newErrors.oversized = `${oversizedFiles.map(f => f.file.name).join(', ')} - Exceeds 2MB limit`;
    }

    // Update form data with all files
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...nonDuplicates]
    }));

    // Update errors state if there are any
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        files: newErrors
      }));
    }
  }, [formData.uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true
  });

  const removeFile = (index) => {
    setFormData(prev => {
      const newFiles = [...prev.uploadedFiles];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);

      // Clear error if no oversized files remain
      const hasOversizedFiles = newFiles.some(file => file.file.size > 2 * 1024 * 1024);
      if (!hasOversizedFiles) {
        setErrors(prev => ({
          ...prev,
          files: undefined
        }));
      }

      return {
        ...prev,
        uploadedFiles: newFiles
      };
    });
  };

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
    if (formData.state) {
      const cities = cityList.filter(city => city.state_id === formData.state.id);
      setFilteredCities(cities);
    } else {
      setFilteredCities([]);
    }
  }, [formData.state]);

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

    // Phone validation with Indian format
        // const phoneRegex = /^[6-9]\d{9}$/;
        // if (!phoneRegex.test(formData.phone)) {
        //     tempErrors.phone = 'Enter valid 10-digit mobile number';
        //     isValid = false;
        // }

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

    // Travel distance validation for "Travel to tutor" option
    if (formData.tutoringTypes.includes('Travel to tutor')) {
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

    // File validation
    const hasInvalidFiles = formData.uploadedFiles.some(file => 
      file.file.size > 2 * 1024 * 1024
    );

    if (hasInvalidFiles) {
      tempErrors.files = {
        oversized: 'Please remove files that exceed 2MB before submitting'
      };
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
        
  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({
                ...prev,
      [name]: value
            }));
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

    return (
    <div className="tutor-request-wrapper">
      <div className="tutor-request-container">
        <div className="form-title">Request a Tutor</div>

        {/* Address Section */}
        <div className="form-section">
          <div className="section-title"><LocationOn /> Address Information</div>
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
        </div>

        {/* Basic Information */}
        <div className="form-section">
          <div className="section-title"><Person /> Basic Information</div>
          <div className="row">
            <div className="input-wrapper col-md-4">
              <TextField
                fullWidth
                name="name"
                value={currentUser?.user.name}
                disabled
                className="input-field"
              />
            </div>
            <div className="input-wrapper col-md-4">
              <TextField
                fullWidth
                name="email"
                value={currentUser?.user.email}
                disabled
                className="input-field"
              />
            </div>
            <div className="input-wrapper col-md-4">
              <TextField
                fullWidth
                name="phone"
                value={currentUser?.user.phone}
                disabled
                InputProps={{
                  startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                }}
                className="input-field"
              />
            </div>
            <div className="input-wrapper col-md-4">
              <FormControl fullWidth>
                <InputLabel>Gender Preference</InputLabel>
                <Select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  label="Gender Preference"
                  className="input-field"
                >
                  <MenuItem value="No preference">No Preference</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Academic Requirements */}
        <div className="form-section">
          <div className="section-title"><School /> Academic Requirements</div>
          <div className="tutor-form-grid">
            <div className="input-wrapper">
              <Autocomplete
                multiple
                freeSolo
                options={commonSubjects}
                value={formData.subjects}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    subjects: newValue
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subjects"
                    error={!!errors.subjects}
                    helperText={errors.subjects || "Type or select multiple subjects"}
                    className="input-field"
                  />
                )}
              />
            </div>
            <div className="input-wrapper">
              <FormControl fullWidth error={!!errors.studentLevel}>
                <InputLabel>Student Level</InputLabel>
                <Select
                  name="studentLevel"
                  value={formData.studentLevel}
                  onChange={handleChange}
                  label="Student Level"
                  className="input-field"
                >
                  <MenuItem value="">Select Level</MenuItem>
                  <MenuItem value="Primary">Primary (1-5)</MenuItem>
                  <MenuItem value="Middle School">Middle School (6-8)</MenuItem>
                  <MenuItem value="High School">High School (9-10)</MenuItem>
                  <MenuItem value="Higher Secondary">Higher Secondary (11-12)</MenuItem>
                  <MenuItem value="College">College</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                </Select>
                {errors.studentLevel && <FormHelperText>{errors.studentLevel}</FormHelperText>}
              </FormControl>
            </div>
          </div>
        </div>

        {/* Tutoring Preferences */}
        <div className="form-section">
          <div className="section-title"><AccessTime /> Tutoring Preferences</div>
          <div className="row">
            <div className="input-wrapper col-md-4">
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
                    label="Tutoring Types"
                    error={!!errors.tutoringTypes}
                    helperText={errors.tutoringTypes || "Select one or more tutoring types"}
                    className="input-field"
                  />
                )}
              />
            </div>
            {formData.tutoringTypes.includes('Travel to tutor') && (
              <div className="input-wrapper col-md-4">
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Travel Distance (km)"
                  name="travelDistance"
                  value={formData.travelDistance}
                  onChange={handleChange}
                  error={!!errors.travelDistance}
                  helperText={errors.travelDistance}
                  InputProps={{
                    inputProps: { min: 1, max: 50 }
                  }}
                  className="input-field"
                />
              </div>
            )}
            <div className="input-wrapper col-md-4">
              <TextField
                fullWidth
                type="number"
                label="Budget (₹ per month)"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                error={!!errors.budget}
                helperText={errors.budget || "Optional - Enter your monthly budget"}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>₹</span>,
                  inputProps: { min: 100 }
                }}
                className="input-field"
              />
            </div>
            <div className="input-wrapper col-md-4">
              <FormControl fullWidth>
                <InputLabel>Time Preference Type</InputLabel>
                <Select
                  name="timePreferenceType"
                  value={formData.timePreferenceType}
                  onChange={handleChange}
                  label="Time Preference Type"
                  className="input-field"
                >
                  {timePreferences.map((pref) => (
                    <MenuItem key={pref.value} value={pref.value}>
                      {pref.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {formData.timePreferenceType === 'fixed' && (
              <div className="input-wrapper col-md-4">
                <FormControl fullWidth>
                  <InputLabel>Preferred Time</InputLabel>
                  <Select
                    name="timePreference"
                    value={formData.timePreference}
                    onChange={handleChange}
                    label="Preferred Time"
                    className="input-field"
                  >
                    {timePreferences.find(p => p.value === 'fixed')?.subOptions.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
        </div>

        {/* Languages Section */}
        <div className="form-section">
          <div className="section-title"><Language /> Language Preferences</div>
          <div className="row">
            <div className="input-wrapper col-md-12">
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
          </div>
        </div>

        {/* Additional Details */}
        <div className="form-section">
          <div className="section-title"><Description /> Additional Details</div>
          <div className="input-wrapper col-md-12">
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Requirement Details"
              name="requirementDetails"
              value={formData.requirementDetails}
              onChange={handleChange}
              error={!!errors.requirementDetails}
              helperText={errors.requirementDetails}
              InputProps={{
                startAdornment: <Description color="action" sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />
              }}
              className="input-field"
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="form-section">
          <div className="section-title"><AttachFile /> Upload Files</div>
          <div className="input-wrapper">
            <div
              {...getRootProps()}
              className={`file-upload-zone${isDragAccept ? ' active' : ''}${isDragReject ? ' reject' : ''}`}
            >
              <input {...getInputProps()} />
              <CloudUpload sx={{ 
                fontSize: 48, 
                color: isDragActive ? 'primary.main' : 'action.active',
                mb: 2,
                transition: 'all 0.3s ease'
              }} />
              <Typography variant="body1" gutterBottom>
                {isDragActive ? 
                  isDragAccept ? 'Drop the files here' : 'This file type is not accepted' :
                  'Drag & drop files here, or click to select files'
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported formats: Images (JPEG, PNG), Documents (PDF, DOC, DOCX, XLS, XLSX)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Maximum file size: 2MB
              </Typography>
            </div>

            {/* File Preview Section */}
            {formData.uploadedFiles.length > 0 && (
              <div className="uploaded-files-preview">
                {formData.uploadedFiles.map((file, index) => {
                  const isOversized = file.file.size > 2 * 1024 * 1024;
                  return (
                    <div
                      key={index}
                      className={`uploaded-file-card${isOversized ? ' oversized' : ''}`}
                    >
                      {file.type === 'image' ? (
                        <img
                          src={file.preview}
                          alt={`Preview ${index + 1}`}
                        />
                      ) : (
                        <>
                          <InsertDriveFile sx={{ 
                            fontSize: 40, 
                            color: isOversized ? '#ff1744' : 'primary.main',
                            mb: 1 
                          }} />
                          <div className="file-name">
                            {file.file.name}
                            {isOversized && (
                              <div className="oversize-badge">Over 2MB</div>
                            )}
                          </div>
                        </>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => removeFile(index)}
                        className="remove-btn"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  );
                })}
              </div>
            )}
            {errors.files && (
              <div className="file-error-box">
                <div className="error-title">Please fix the following issues:</div>
                {errors.files.oversized && (
                  <div className="file-error-msg">• Size limit exceeded: {errors.files.oversized}</div>
                )}
                {errors.files.invalidFormat && (
                  <div className="file-error-msg">• Invalid format: {errors.files.invalidFormat}</div>
                )}
                {errors.files.duplicate && (
                  <div className="file-error-msg">• Duplicate files: {errors.files.duplicate}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-section">
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            className="submit-btn"
          >
            Submit Request
          </Button>
        </div>
      </div>
    </div>
    );
};

export default RequestTutor; 