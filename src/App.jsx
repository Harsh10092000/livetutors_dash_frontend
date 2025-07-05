import { useContext } from 'react';
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import { AuthContext } from './context2/AuthContext';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
// import Table from './pages/table/Table';
import Index from './pages/index/Index';
import RequestTutor from './pages/requesttutor/RequestTutor';
import TutorProfileForm from './pages/tutorProfileForm/TutorProfileForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([

  // {
  //   path: "/table",
  //   element: <Table />,
  // },
  {
    path: "/",
    element: (
      // <ProtectedRoute>
        <Index />
      // </ProtectedRoute>
    ),
    children: [
      {
        path: "my-jobs",
        element: (
          <>
            {/* <SendJwt /> */}
            <Dashboard />
          </>
        ),
      },
      {
        path: "request-tutor",
        element: (
          <RequestTutor />
        ),
      },
      {
        path: "become-a-tutor",
        element: (
          <TutorProfileForm />
        ),
      },
     
]}
  
])

function App() {

  const {currentUser} = useContext(AuthContext);
  console.log('currentUser ', currentUser);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App 