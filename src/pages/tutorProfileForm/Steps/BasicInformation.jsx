import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, IconButton, Button } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context2/AuthContext';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { TutorContext } from '../../../context2/TutorContext.jsx';
import { toast } from 'react-toastify';
const BasicInformation = ({ showStep, setShowStep, handleNextStep }) => {
    const [tutorId, setTutorId] = useState(null);
    

    const { currentUser } = useContext(AuthContext);
    const { triggerImageFetch } = useContext(TutorContext);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        genderPreference: '',
        tagline: '',
        requirementDetails: ''
    });
    // Add state for profile picture
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);

    useEffect(() => {
        if(currentUser?.user.id){
            axios
                .get(import.meta.env.VITE_BACKEND + `/api/becameTutor/fetchBasicInfo/${currentUser?.user.id}`)
                .then((res) => {
                    if(res.data && res.data.length > 0) {
                        setFormData({
                            ...formData,
                            name: res.data[0].name,
                            email: res.data[0].email,
                            phone: res.data[0].phone,
                            genderPreference: res.data[0].gender,
                            tagline: res.data[0].profile_tag_line,
                            requirementDetails: res.data[0].profile_desc,
                        });
                        setTutorId(res.data[0].tutor_id);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching basic info:', error);
                });
        }
    }, [currentUser?.user.id]);

    // Handler for file input
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };
    const handleRemoveProfilePic = () => {
        setProfilePic(null);
        setProfilePicPreview(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateStep1 = () => {
        let tempErrors = {};
        let isValid = true;
        if (!formData.genderPreference) {
            tempErrors.genderPreference = 'Gender is required';
            isValid = false;
        }
        if (!formData.requirementDetails || formData.requirementDetails.trim().length < 10) {
            tempErrors.requirementDetails = 'Profile description is required (min 10 chars)';
            isValid = false;
        }
        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep1()) {
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append('name', currentUser?.user.name);
        formDataToSend.append('email', currentUser?.user.email);
        formDataToSend.append('phone', currentUser?.user.phone);
        formDataToSend.append('gender', formData.genderPreference);
        formDataToSend.append('profile_tag_line', formData.tagline);
        formDataToSend.append('profile_desc', formData.requirementDetails);
        formDataToSend.append('image', profilePic);
        formDataToSend.append('user_id', currentUser?.user.id);

        try {
            if (tutorId) {
                const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/becameTutor/updateBasicInfo/${tutorId}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                if (response.status === 200) {
                    toast.success('Basic information updated successfully!');
                    triggerImageFetch();
                    handleNextStep();
                }
            } else {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/becameTutor/addBasicInfo`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                if (response.status === 201) {
                    toast.success('Basic information saved successfully!');
                    triggerImageFetch();
                    handleNextStep();
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
            <div className={`section-content-animated${showStep == 1 ? ' open' : ''}`}>
                <div className="row">
                    <div className="input-wrapper col-md-4">
                        <TextField fullWidth name="name" value={currentUser?.user.name} disabled className="input-field" />
                    </div>
                    <div className="input-wrapper col-md-4">
                        <TextField fullWidth name="email" value={currentUser?.user.email} disabled className="input-field" />
                    </div>
                    <div className="input-wrapper col-md-4">
                        <TextField fullWidth name="phone" value={currentUser?.user.phone} disabled className="input-field" />
                    </div>
                    <div className="input-wrapper col-md-4">
                        <FormControl fullWidth error={!!errors.genderPreference}>
                            <InputLabel>Gender</InputLabel>
                            <Select name="genderPreference" value={formData.genderPreference} onChange={handleChange} label="Gender" className="input-field">
                                <MenuItem value="No preference">No Preference</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                            </Select>
                            {errors.genderPreference && <FormHelperText>{errors.genderPreference}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div className="input-wrapper col-md-4 profile-pic-col">
                        <TextField
                            // label="Profile Picture"
                            value={profilePic ? profilePic.name : ''}
                            placeholder="Upload Profile Picture"
                            fullWidth
                            InputProps={{
                                readOnly: true,
                                onClick: () => document.getElementById('profile-pic-input').click(),
                                style: { cursor: 'pointer', background: '#fff' }
                            }}
                            className="input-field profile-pic-textfield"
                        />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-pic-input"
                            type="file"
                            onChange={handleProfilePicChange}
                        />

                    </div>
                    <div className='input-wrapper col-md-4'>
                        {profilePicPreview && (
                            <div className="profile-pic-preview-box">
                                <img src={profilePicPreview} alt="Profile Preview" className="profile-pic-preview-img" />
                                <IconButton onClick={handleRemoveProfilePic} className="profile-pic-remove-btn" aria-label="Remove">
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        )}
                    </div>
                    <div className="input-wrapper col-md-12">
                        <TextField
                            label="Tagline"
                            name="tagline"
                            value={formData.tagline || ''}
                            onChange={e => {
                                const value = e.target.value.slice(0, 100);
                                // Only allow letters, numbers, and (.,!:'), and spaces
                                const valid = /^[a-zA-Z0-9 .,!:']*$/.test(value);
                                setFormData(prev => ({ ...prev, tagline: value }));
                                setErrors(prev => ({ ...prev, tagline: valid ? undefined : "Text must contain only letters, numbers and (.,!:')," }));
                            }}
                            error={!!errors.tagline}
                            helperText={errors.tagline || `${(formData.tagline || '').length}/100 characters`}
                            fullWidth
                            inputProps={{ maxLength: 100 }}
                            placeholder="Stand out with a short tagline that describes what you do."
                            className="input-field"
                        />
                    </div>
                    <div className="input-wrapper col-md-12">
                        <TextField
                            label="Description"
                            name="requirementDetails"
                            value={formData.requirementDetails}
                            onChange={e => {
                                const value = e.target.value.slice(0, 600);
                                setFormData(prev => ({ ...prev, requirementDetails: value }));
                            }}
                            error={!!errors.requirementDetails}
                            helperText={errors.requirementDetails || `${formData.requirementDetails.length}/600 characters`}
                            fullWidth
                            multiline
                            rows={3}
                            inputProps={{ maxLength: 600 }}
                            placeholder="Describe your teaching experience, skills, and what makes you unique as a tutor."
                            className="input-field"
                        />
                    </div>

                </div>
                <div className="step-btn-group">
                    <Button variant="contained" className="save-next-btn" onClick={handleSubmit}>Save & Next</Button>
                </div>
            </div>
        )
    }

export default BasicInformation