import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { TutorContext } from '../../context2/TutorContext.jsx';

const DashboardHeader = ({ onToggleSidebar, currentUser} ) => {
  const { imageUpdateTrigger } = useContext(TutorContext);
  const [tutorImage, setTutorImage] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const fetchTutorImage = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/becameTutor/getTutorImageIsActive/${currentUser?.user?.id}`);
      console.log("response : ", response)
      if (response.data.length > 0) {
        setTutorImage(response.data[0].profile_pic_url);
        setIsActive(response.data[0].is_active);
      }
    } catch (error) {
      console.error('Error fetching tutor image:', error);
    }
  }, [currentUser?.user?.id]);
  useEffect(() => {
    fetchTutorImage();
  }, [fetchTutorImage, imageUpdateTrigger]);
  return (

  
  <div className="d-flex justify-content-between align-items-center">
    {console.log("onToggleSidebar : ", onToggleSidebar)}
    <div className="d-flex align-items-center dashboard-header-inside-left">
     <div className='sidebar-toggle-icon' onClick={onToggleSidebar}>
     <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--custom minimal__iconify__root css-18oi841" id="«rl»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" opacity="0.4" d="M15.7798 4.5H5.2202C4.27169 4.5 3.5 5.06057 3.5 5.75042C3.5 6.43943 4.27169 7 5.2202 7H15.7798C16.7283 7 17.5 6.43943 17.5 5.75042C17.5 5.06054 16.7283 4.5 15.7798 4.5Z"></path> <path fill="currentColor" d="M18.7798 10.75H8.2202C7.27169 10.75 6.5 11.3106 6.5 12.0004C6.5 12.6894 7.27169 13.25 8.2202 13.25H18.7798C19.7283 13.25 20.5 12.6894 20.5 12.0004C20.5 11.3105 19.7283 10.75 18.7798 10.75Z"></path> <path fill="currentColor" d="M15.7798 17H5.2202C4.27169 17 3.5 17.5606 3.5 18.2504C3.5 18.9394 4.27169 19.5 5.2202 19.5H15.7798C16.7283 19.5 17.5 18.9394 17.5 18.2504C17.5 17.5606 16.7283 17 15.7798 17Z"></path></svg>
    </div>
      <div className="dashboard-heading">
        <div>Dashboard</div>
      </div>
    </div>
    <div className="d-flex align-items-center dashboard-header-inside-right">
      <div className="user-icon" aria-label="User profile">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg> */}

{console.log("tutorImage : ", tutorImage)
}
        {tutorImage ? <img src={tutorImage} /> : <img src='https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-25.webp' />}
      </div>
      <div className="ms-2">
        <div>{currentUser?.user?.name}</div>
        <div>{currentUser?.user?.email}</div>
      </div>
    </div>
  </div>
  )
};

export default DashboardHeader;