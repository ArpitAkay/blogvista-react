import React from 'react'
import './Search.css'

const Search = (props) => {
    
    return (
        <div className="w-100 d-flex justify-content-center">
            <form style={{ width: "50%" }} onSubmit={props.handleSearchSubmit}>
                <input className="form-control me-2 fst-italic" type="search" placeholder="Type to search..." aria-label="Search" value={props.searchText} onChange={props.handleSearchChange} />
            </form>
        </div>
    )
}

export default Search
