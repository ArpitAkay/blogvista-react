import React from 'react'
import Navbar from '../navbar/Navbar';

const Home = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Navbar />
      <div className="w-100 d-flex justify-content-center mt-5">
        <form style={{width: "50%"}}>
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
        </form>
      </div>
    </div>
  )
}

export default Home;
