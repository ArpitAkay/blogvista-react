import React from 'react'

const Search = () => {
    return (
        <div className="w-100 d-flex justify-content-center mt-5">
            <form style={{ width: "50%" }}>
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            </form>
        </div>
    )
}

export default Search
