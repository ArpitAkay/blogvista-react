import React from 'react'

const Footer = () => {
    return (
        <div className="bg-primary-subtle" id="footer">
            <div className="container">
                <div className="row justify-content-center p-3 p-md-5">
                    <div className="col-12 col-md-4">
                        <h5 className="text-center">About Us</h5>
                        <p className="text-center">Where stories come alive. Join us to create, connect, and inspire through the art of blogging. Your voice, your platform</p>
                    </div>
                    <div className="col-12 col-md-4 mt-4 mt-md-0">
                        <h5 className="text-center">Developer Socials</h5>
                        <p className="text-center"><b>Email</b> : arpitkumar4000@gmail.com</p>
                        <div className="d-flex justify-content-evenly justify-content-md-evenly mt-4">
                            <i className="fa-brands fa-facebook fa-xl" onClick={() => window.open("https://www.facebook.com/arpitkumar4000/", "_blank")}></i>
                            <i className="fa-brands fa-square-instagram fa-xl" onClick={() => window.open("https://www.instagram.com/arpit_noob31/", "_blank")}></i>
                            <i className="fa-brands fa-square-x-twitter fa-xl" onClick={() => window.open("https://twitter.com/arpit_noob31", "_blank")}></i>
                            <i className="fa-brands fa-linkedin fa-xl" onClick={() => window.open("https://www.linkedin.com/in/arpit-kumar-5a26201b4/", "_blank")}></i>
                            <i className="fa-brands fa-square-github fa-xl" onClick={() => window.open("https://github.com/ArpitAkay", "_blank")}></i>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 mt-5 mt-md-0">
                        <h5 className="text-center">Newsletter</h5>
                        <p className="text-center">Coming Soon</p>
                    </div>
                </div>
            </div>


            <div className="d-flex justify-content-center pb-4">
                <p>Copyright &#169;2023 All rights reserved</p>
            </div>
        </div>
    )
}

export default Footer
