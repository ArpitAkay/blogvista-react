import React from 'react'
import './SearchResult.css'
import { useNavigate } from 'react-router-dom'

const SearchResult = (props) => {
    const navigate = useNavigate();


    return (
        <div className="text-center fst-italic border border-bottom-0 rounded shadow-sm p-1 bg-light" id="search-result-box" onClick={() => navigate("/showBlog/" + props.blogId)}>{props.title}</div>
    )
}

export default SearchResult
