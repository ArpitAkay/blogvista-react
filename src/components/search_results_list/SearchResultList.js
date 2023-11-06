import React from 'react'
import SearchResult from '../search_result/SearchResult'
import './SearchResultList.css'

const SearchResultList = (props) => {
    return (
        <div className="w-100 d-flex flex-column align-items-center mt-2 z-3 position-absolute" id="search-result-list">
            <div style={{ width: "50%" }}>
                {props.searchedBlogResults.map((blog) => {
                    return <SearchResult key={blog.blogId} blogId={blog.blogId} title={blog.title} /> 
                })}
            </div>
        </div>
    )
}

export default SearchResultList
