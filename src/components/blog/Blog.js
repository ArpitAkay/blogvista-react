import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import imageNotAvailable from '../../images/imageNotAvailable.png'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const Blog = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const auth = useSelector((state) => state.auth);

    const handleChangeStatusClick = async (blog) => {
        setLoading(true);
        const statusToSend = blog.status === "CREATED" ? "PUBLISH" : "UNPUBLISH";
        const result = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${statusToSend.toLowerCase()} it!`
        });

        if (result.isConfirmed) {
            const requestParams = {
                blogId: blog.blogId,
                blogStatus: statusToSend
            }

            const headers = {
                "Authorization": "Bearer " + auth.authToken
            };

            const hostname = process.env.REACT_APP_HOST_AND_PORT;
            const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_UPDATE_BLOG_STATUS;

            const response = await WebServiceInvokerRest(
                hostname,
                urlContent,
                "PATCH",
                headers,
                null,
                requestParams
            );

            if (response.status === 200) {
                blog.status = statusToSend === "PUBLISH" ? "PUBLISHED" : "CREATED";
                props.showToast("Success", `Blog ${statusToSend.toLowerCase() + "ed"} successfully`);
            }
            else {
                props.showToast("Failed", "Error updating blog status");
            }
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="card mb-3" style={{ maxWidth: "830px", minHeight: "186px" }}>
                <div className="row g-0 shadow">
                    <div className="col-md-4">
                        <img src={props.blog.previewImageUrl === null ? imageNotAvailable : props.blog.previewImageUrl} className="img-fluid rounded-start h-100 w-100 object-fit-cover" alt="Error loading" />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <h5 className="card-title"><i>{props.blog.title.length > 100 ? props.blog.title.slice(0, 100) + "..." : props.blog.title}</i></h5>
                                {props.updateDeleteBtn && <div className="d-flex">
                                    <div className="me-1">
                                        <i className="fa-solid fa-pen-to-square" onClick={() => navigate(`/editBlog/${props.blog.blogId}`)}></i>
                                    </div>
                                    <div className={`ms-1 ${loading ? "disabled" : ""}`}>
                                        <i className="fa-solid fa-trash" onClick={() => props.deleteBlog(props.blog.blogId)}></i>
                                    </div>
                                </div>}
                            </div>
                            <p className="card-text m-0"><i>{"- " + props.blog.category}</i></p>
                            <p className="card-text m-0"><i>{"- " + props.blog.author}</i></p>
                            {props.showStatus && <p className="card-text m-0"><i>{"- " + props.blog.status}</i></p>}
                            <div className="d-flex flex-row justify-content-between mt-3">
                                {props.showCheckoutBtn && <Link to={"/showBlog/" + props.blog.blogId} className="btn btn-success btn-sm "><i>CHECKOUT</i></Link>}
                                {props.showPublishBtn && <button type="button" className={`btn btn-sm ${props.blog.status === "CREATED" ? "btn-success" : "btn-danger"}`} name={props.blog.status === "CREATED" ? "PUBLISH" : "UNPUBLISH"} onClick={() => handleChangeStatusClick(props.blog)} disabled={loading}>
                                    <span className="spinner-border-sm" aria-hidden="true"></span>
                                    <span role="status">
                                        <i id="btn-status">{props.blog.status === "CREATED" ? "PUBLISH" : "UNPUBLISH"}</i>
                                    </span>
                                </button>}
                                <p className="card-text mt-1"><i>{"- " + props.blog.createdDate.split("T")[0]}</i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blog