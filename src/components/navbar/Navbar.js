import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { updateAuth } from '../../redux/slices/AuthSlice';
import './Navbar.css'

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const location = useLocation();

    const handleLogout = () => {
        dispatch(updateAuth({
            type: "LoggedOut",
            state: {
                name: "",
                email: "",
                authToken: "",
                refreshToken: "",
            },
        }))
        navigate("/login");
    }

    const handleContactClick = () => {
        document.getElementById("footer").scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <nav className="navbar navbar-expand-lg bg-primary-subtle">
            <div className="container-fluid w-75">
                <Link className="navbar-brand" to="/">BlogVista</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {(auth.isAuthenticated && location.pathname !== "/mail/forgetPassword" && location.pathname !== "/mail/verifyEmail") &&  <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>}
                        {(auth.isAuthenticated && location.pathname !== "/mail/forgetPassword" && location.pathname !== "/mail/verifyEmail") && <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" onClick={handleContactClick}>Contact</Link>
                        </li>}
                    </ul>
                    {(auth.isAuthenticated && location.pathname !== "/mail/forgetPassword" && location.pathname !== "/mail/verifyEmail") && <span className="navbar-text d-flex flex-row align-items-baseline me-2">
                        <i className="fa-solid fa-pen-nib me-2" onClick={() => navigate("/writeBlog")}></i>
                        <Link className="nav-link active" aria-current="page" to="/writeBlog">Write</Link>
                    </span>}
                    {(!auth.isAuthenticated || location.pathname === "/mail/forgetPassword" || location.pathname === "/mail/verifyEmail") && <span className="navbar-text d-flex flex-row align-items-baseline me-2">
                        {(location.pathname === "/signup" || location.pathname === "/forgetPassword" || location.pathname === "/verifyEmail" || location.pathname === "/mail/forgetPassword" || location.pathname === "/mail/verifyEmail") && <button className="btn btn-sm btn-primary" type="button" onClick={() => navigate("/login")}>Login</button>}
                        {location.pathname === "/login" && <button className="btn btn-sm btn-primary" type="button" onClick={() => navigate("/signup")}>Sign Up</button>}
                    </span>}
                    {(auth.isAuthenticated && location.pathname !== "/mail/forgetPassword" && location.pathname !== "/mail/verifyEmail")&& <div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "none" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                                    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                                </svg>
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/myAccount">My Account</Link></li>
                                <li><Link className="dropdown-item" to="/myBlogs">My Blogs</Link></li>
                                <li><Link className="dropdown-item" onClick={handleLogout}>Logout</Link></li>
                            </ul>
                        </div>
                    </div>}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
