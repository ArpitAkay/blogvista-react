import React from 'react'
import { Link } from 'react-router-dom'
import Image_not_available from '../../images/Image_not_available.png';

const Blog = (props) => {
    // eslint-disable-next-line
    const { author, blogId, category, content, createdDate, previewImageUrl, status, title, userInfo } = props.blog;

    return (
        <div className="container">
            <div className="card mb-3 shadow bg-body-tertiary rounded">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src={previewImageUrl === null ? Image_not_available : previewImageUrl} className="img-fluid rounded-start" alt="Error loading" />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title"><i>{title}</i></h5>
                            <p className="card-text m-0"><i>{"- " + category}</i></p>
                            <p className="card-text"><i>{"- " + author}</i></p>
                            <div className="d-flex flex-row justify-content-between">
                                <Link to={"/showBlog/" + blogId} className="btn btn-primary"><i>Checkout</i></Link>
                                <p className="card-text mt-3"><i>{"- " + createdDate.split("T")[0]}</i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blog;
