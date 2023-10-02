import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Login from './components/login/Login'
import Signup from './components/signup/Signup';
import Home from './components/home/Home';
import ForgetPassword from './components/forget_password/ForgetPassword';
import Toast from './components/toast/Toast';
import { useState } from 'react';
import Spinner from './components/spinner/Spinner';
import MyAccount from './components/my_account/MyAccount';
import ProtectedRoutes from './components/protected_routes/ProtectedRoutes';

function App() {
  const [toast, setToast] = useState(false);
  const [heading, setHeading] = useState("");
  const [message, setMessage] = useState("");

  const showToast = (heading, message) => {
    setToast(true);
    setHeading(heading);
    setMessage(message);

    setTimeout(() => {
      // setToast(false)
    }, 5000)
  }

  return (
    <>
      <Toast toast={toast} heading={heading} message={message} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login showToast={showToast} />} />
          <Route path="/signup" element={<Signup showToast={showToast} />} />
          <Route path="/forgetPassword" element={<ForgetPassword showToast={showToast} />} />
          <Route path='/spinner' element={<Spinner />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/myAccount" element={<MyAccount />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
