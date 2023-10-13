import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Login from './components/login/Login'
import Signup from './components/signup/Signup';
import Home from './components/home/Home';
import Toast from './components/toast/Toast';
import { useState } from 'react';
import Spinner from './components/spinner/Spinner';
import MyAccount from './components/my_account/MyAccount';
import ProtectedRoutes from './components/protected_routes/ProtectedRoutes';
import SendEmail from './components/send_email/SendEmail';
import ForgetPassword from './components/forget_password/ForgetPassword';
import VerifyEmail from './components/verify_email/VerifyEmail';
import WriteBlog from './components/write_blog/WriteBlog';
import ShowBlog from './components/show_blog/ShowBlog';
import MyBlogs from './components/my_blogs/MyBlogs';
import EditBlog from './components/edit_blog/EditBlog';

function App() {
  const [toast, setToast] = useState(false);
  const [heading, setHeading] = useState("");
  const [message, setMessage] = useState("");

  const showToast = (heading, message) => {
    setToast(true);
    setHeading(heading);
    setMessage(message);

    setTimeout(() => {
      setToast(false)
    }, 5000)
  }

  return (
    <>
      <Toast toast={toast} heading={heading} message={message} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login showToast={showToast} />} />
          <Route path="/signup" element={<Signup showToast={showToast} />} />
          <Route path="/forgetPassword" element={<SendEmail showToast={showToast} />} />
          <Route path="/verifyEmail" element={<SendEmail showToast={showToast} />} />
          <Route path="/mail/forgetPassword" element={<ForgetPassword showToast={showToast} />} />
          <Route path="/mail/verifyEmail" element={ <VerifyEmail showToast={showToast} />} />
          <Route path='/spinner' element={<Spinner />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home showToast={showToast} />} />
            <Route path="/myAccount" element={<MyAccount showToast={showToast} />} />
            <Route path="/writeBlog" element={<WriteBlog showToast={showToast} />} />
            <Route path="/showBlog/:blogId" element={<ShowBlog showToast={showToast} />} />
            <Route path="/myBlogs" element={<MyBlogs showToast={showToast} />} />
            <Route path="/editBlog/:blogId" element={<EditBlog showToast={showToast} />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
