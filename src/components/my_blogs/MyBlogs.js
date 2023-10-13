import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import { useSelector } from 'react-redux'
import { WebServiceInvokerRest } from "../../util/WebServiceInvoker";
import Footer from '../footer/Footer';
import Image_not_available from '../../images/Image_not_available.png'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'

const MyBlogs = (props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  // eslint-disable-next-line
  const [totalPages, setTotalPages] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const loadBlogsByEmail = async () => {
    const requestParams = {
      pageNo: pageNo,
      pageSize: pageSize
    }

    const headers = {
      "Authorization": "Bearer " + auth.authToken
    };

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_GET_BLOGS_BY_EMAIL;

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "GET",
      headers,
      null,
      requestParams
    );

    if (response.status === 200) {
      console.log(response);
      setCurrentPage(response.data.currentPage);
      setHasNext(response.data.hasNext);
      setHasPrevious(response.data.hasPrevious);
      setTotalPages(response.data.totalPages)
      setBlogs(response.data.blogs);
    }
    else {
      props.showToast("Failed", "Error fetching blogs");
    }
  }

  useEffect(() => {
    loadBlogsByEmail();
  }, []);

  const handleChangeStatusClick = async (blog) => {
    const requestParams = {
      blogId: blog.blogId,
      blogStatus: blog.status === "CREATED" ? "PUBLISH" : "UNPUBLISH"
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
      console.log(response);
    }
    else {
      props.showToast("Failed", "Error fetching blogs");
    }
  }

  const handleDeleteBlogClick = async (blogId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const requestParams = {
        blogId: blogId
      }

      const headers = {
        "Authorization": "Bearer " + auth.authToken
      };

      const hostname = process.env.REACT_APP_HOST_AND_PORT;
      const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_DELETE_BLOG_BY_ID;

      const response = await WebServiceInvokerRest(
        hostname,
        urlContent,
        "DELETE",
        headers,
        null,
        requestParams
      );

      if (response.status === 200) {
        props.showToast("Success", "Error fetching blogs");
      }
      else {
        props.showToast("Failed", "Error fetching blogs");
      }
    }
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Navbar />
      <div>
        <h4 className="text-center my-5"><i>{auth.name + "'s blogs"}</i></h4>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center m-5">
        {
          blogs.map(blog => {
            return <div class="card mb-3" style={{ maxWidth: "850px" }}>
              <div class="row g-0">
                <div class="col-md-4">
                  <img src={blog.previewImageUrl === null ? Image_not_available : blog.previewImageUrl} class="img-fluid rounded-start" alt="Error loading" />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 class="card-title"><i>{blog.title.length > 100 ? blog.title.slice(0, 100) + "..." : blog.title}</i></h5>
                      <div className="d-flex">
                        <div className="me-1">
                          <i class="fa-solid fa-pen-to-square" onClick={() => navigate(`/editBlog/${blog.blogId}`)}></i>

                        </div>
                        <div className="ms-1">
                          <i class="fa-solid fa-trash" onClick={() => handleDeleteBlogClick(blog.blogId)}></i>
                        </div>
                      </div>
                    </div>
                    <p className="card-text m-0"><i>{"- " + blog.category}</i></p>
                    <p className="card-text m-0"><i>{"- " + blog.author}</i></p>
                    <p className="card-text m-0"><i>{"- " + blog.status}</i></p>
                    <div className="d-flex flex-row justify-content-between">
                      <button type="button" class={`btn btn-sm mt-1 ms-2 ${blog.status === "CREATED" ? "btn-success": "btn-danger"}`} name={blog.status === "CREATED" ? "PUBLISH" : "UNPUBLISH"} onClick={() => handleChangeStatusClick(blog)} ><i id="btn-status">{blog.status === "CREATED" ? "PUBLISH" : "UNPUBLISH"}</i></button>
                      <p className="card-text mt-1"><i>{"- " + blog.createdDate.split("T")[0]}</i></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          })
        }
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default MyBlogs
