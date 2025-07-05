import { createContext, useState } from 'react';

export const TutorContext = createContext();

export const TutorProvider = ({ children }) => {
  const [imageUpdateTrigger, setImageUpdateTrigger] = useState(0);

  const triggerImageFetch = () => {
    setImageUpdateTrigger((prev) => prev + 1);
  };

  console.log("imageUpdateTrigger : ", imageUpdateTrigger);

  return (
    <TutorContext.Provider value={{ imageUpdateTrigger, triggerImageFetch }}>
      {children}
    </TutorContext.Provider>
  );
};
