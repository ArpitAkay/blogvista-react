import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../navbar/Navbar'
import { useSelector } from 'react-redux'
import { WebServiceInvokerRest } from "../../util/WebServiceInvoker";
import Footer from '../footer/Footer';
import Image_not_available from '../../images/Image_not_available.png'
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';

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
  const editorRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [blogCategory, setBlogCategory] = useState("");

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

  const handleChangeStatusClick = async (blogId) => {
    console.log(blogId);
    console.log(document.getElementById("btn-status").name);

    const requestParams = {
      blogId: blogId,
      blogStatus: document.getElementById("btn-status").name
    }

    const headers = {
      "Authorization": "Bearer " + auth.authToken
    };

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_UPDATE_BLOG_STATUS;

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "POST",
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

  const handleEditBlogClick = async (blog) => {
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

  const handleFetchCategories = async () => {
    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_CATEGORY_ENDPOINT + process.env.REACT_APP_GET_ALL_CATEGORIES;

    const headers = {
      Authorization: "Bearer " + auth.authToken,
    }

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "GET",
      headers,
      null,
      null
    );
    console.log(response);

    if (response.status === 200) {
      setCategories(response.data);
    }
    else {
      props.showToast("Failed", "Error loading categories");
    }
  }

  const handleSelectedCategory = (event) => {
    setBlogCategory(event.target.value);
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
            return <div class="card mb-3" style={{ "max-width": "940px" }}>
              <div class="row g-0">
                <div class="col-md-4">
                  <img src={blog.previewImageUrl === null ? Image_not_available : blog.previewImageUrl} class="img-fluid rounded-start" alt="Error loading" />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <div className="d-flex justify-content-around">
                      <h5 class="card-title"><i>{blog.title}</i></h5>
                      <div className="d-flex">
                        <div className="me-1">
                          <i class="fa-solid fa-pen-to-square" onClick={() => handleEditBlogClick(blog)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>

                          <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h1 class="modal-title fs-5" id="exampleModalLabel"><i>Edit your blog</i></h1>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">

                                  <div className="m-4">
                                    <input type="text" className="form-control border-0 border-bottom shadow-none" value={blog.title} placeholder="Your title goes here" required style={{"fontStyle": "italic"}}/>
                                  </div>

                                  <div className="m-4 d-flex flex-column justify-content-center align-items-center">
                                    <label htmlFor="formFile" className="form-label"><h5><i>Preview image</i></h5></label>
                                    {/* <input className="form-control" type="file" id="formFile" onChange={{}} /> */}
                                    <img src={blog.previewImageUrl === null ? Image_not_available : blog.previewImageUrl} class="img-fluid w-50 h-50 border rounded-4" alt="..."></img>
                                  </div>

                                  <div className="m-4 d-flex flex-column justify-content-center align-items-center">
                                    <label htmlFor="formFile" className="form-label"><h5><i>Category</i></h5></label>
                                    <select className="form-select  w-50 h-50" aria-label="Default select example" value={blog.category} onClick={handleFetchCategories} onChange={handleSelectedCategory} required >
                                      <option className="text-center">Select your article category</option>
                                      {categories.map((category) => (
                                        <option key={category.categoryId} value={category.title}>{category.title}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="m-4 d-flex flex-column align-items-center">
                                    <label htmlFor="exampleInputPassword1" className="form-label"><h5><i>Update your content</i></h5></label>
                                    <Editor
                                      tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                                      onInit={(evt, editor) => editorRef.current = editor}
                                      initialValue={blog.content}
                                      init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                          'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                          'bold italic forecolor | alignleft aligncenter ' +
                                          'alignright alignjustify | bullist numlist outdent indent | ' +
                                          'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                      }}
                                    />
                                  </div>

                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  <button type="button" class="btn btn-primary">Save changes</button>
                                </div>
                              </div>
                            </div>
                          </div>

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
                      <button type="button" class="btn btn-primary btn-sm mt-3 ms-2" id="btn-status" onClick={() => handleChangeStatusClick(blog.blogId)} name={blog.status === "CREATED" ? "PUBLISH" : "UNPUBLISH"}><i>{blog.status === "CREATED" ? "PUBLISH" : "UNPUBLISH"}</i></button>
                      <p className="card-text mt-3"><i>{"- " + blog.createdDate.split("T")[0]}</i></p>
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
