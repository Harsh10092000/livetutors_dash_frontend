import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  
  const clearUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('userToken');
  };

  useEffect(() => {
    // Try to get session from dashboard backend (which fetches from livetutors)
    axios
      .get('http://localhost:8010/api/session/getSessionData', {
        withCredentials: true,
      })
      .then((res) => {
        console.log('AuthContext - Session data from dashboard:', res.data);
        
        if (res.data.token) {
          // Check if session is expired
          if (res.data.expires) {
            const expiryDate = new Date(res.data.expires);
            const currentDate = new Date();
            
            if (expiryDate <= currentDate) {
              console.log('Session expired at:', expiryDate);
              localStorage.removeItem('userToken');
              setCurrentUser(null);
              return;
            }
            
            console.log('Session valid, expires at:', expiryDate);
          }
          
          // Store token in localStorage for future use
          localStorage.setItem('userToken', res.data.token);
          
          // Set current user with proper structure
          setCurrentUser({
            user: res.data.user,
            token: res.data.token
          });
        } else {
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        console.error('AuthContext - Dashboard session error:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        
        // If dashboard session fails, try direct livetutors session
        axios
          .get('http://localhost:3000/api/auth/session', {
            withCredentials: true,
          })
          .then((livetutorsRes) => {
            console.log('AuthContext - Direct livetutors session:', livetutorsRes.data);
            
            if (livetutorsRes.data.token) {
              // Check if session is expired
              if (livetutorsRes.data.expires) {
                const expiryDate = new Date(livetutorsRes.data.expires);
                const currentDate = new Date();
                
                if (expiryDate <= currentDate) {
                  console.log('Direct livetutors session expired at:', expiryDate);
                  localStorage.removeItem('userToken');
                  setCurrentUser(null);
                  return;
                }
                
                console.log('Direct livetutors session valid, expires at:', expiryDate);
              }
              
              localStorage.setItem('userToken', livetutorsRes.data.token);
              setCurrentUser({
                user: livetutorsRes.data.user,
                token: livetutorsRes.data.token
              });
            } else {
              setCurrentUser(null);
            }
          })
          .catch((livetutorsErr) => {
            console.error('AuthContext - Direct livetutors session error:', livetutorsErr);
            setCurrentUser(null);
          });
      });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};