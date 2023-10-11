import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';

const WriteBlog = (props) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogPreviewImage, setBlogPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [blogCategory, setBlogCategory] = useState("");
  const [blogStatus, setBlogStatus] = useState("");
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const auth = useSelector((state) => state.auth);

  // const log = (event) => {
  //   event.preventDefault();
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };

  const handleFetchCategories = async () => {
    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_CATEGORY_ENDPOINT + process.env.REACT_APP_GET_ALL_CATEGORIES;

    const headers = {
      Authorization: "Bearer " + auth.authToken,
    }
    console.log(headers);

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

  const handleBlogTitle = (event) => {
    setBlogTitle(event.target.value);
  }

  const handleFileChange = (event) => {
    setBlogPreviewImage(event.target.files[0]);
  }

  const handleSelectedCategory = (event) => {
    console.log(event.target.value)
    setBlogCategory(event.target.value);
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault();

    const spinnerElem = blogStatus === "CREATED" ? document.getElementById("create-loader") : document.getElementById("publish-loader");
    const textElem = blogStatus === "CREATED" ? document.getElementById("create-text") : document.getElementById("publish-text");

    spinnerElem.classList.add("spinner-border");
    textElem.classList.add("visually-hidden");

    const validationBoolean = await checkValidationsForCreateBlog();

    if (validationBoolean) {
      spinnerElem.classList.remove("spinner-border");
      textElem.classList.remove("visually-hidden");
      return;
    }

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_CREATE_BLOG;

    const requestBody = {
      title: blogTitle,
      category: blogCategory,
      content: editorRef.current.getContent(),
      status: blogStatus
    }

    const formData = new FormData();
    formData.append("blogData", JSON.stringify(requestBody));
    formData.append("blogPreviewImage", blogPreviewImage);

    const headers = {
      Authorization: "Bearer " + auth.authToken,
      'Content-Type': 'multipart/form-data'
    }

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "POST",
      headers,
      formData,
      null
    );

    spinnerElem.classList.remove("spinner-border");
    textElem.classList.remove("visually-hidden");

    if (response.status === 200) {
      setBlogTitle("");
      setBlogCategory("");
      editorRef.current.setContent("");
      props.showToast("Success", "Blog created successfully");
    }
    else {
      props.showToast("Failed", "Error creating blog, please try again later");
    }
  }

  const checkValidationsForCreateBlog = async () => {
    if (blogTitle.trim().length < 10) {
      props.showToast("Failed", "Blog title should be at least 10 characters long");
      return true;
    }
    if (blogCategory === "" || blogCategory === "Select your article category") {
      props.showToast("Failed", "Please select a category");
      return true;
    }
    if (editorRef.current.getContent().trim().length < 100) {
      props.showToast("Failed", "Blog content should be at least 100 characters long");
      return true;
    }
  }

  return (
    <>
      <div className="d-flex flex-row justify-content-center" style={{ width: "100vw" }}>
        <div className="border border-primary rounded-4 p-5" style={{ width: "80%" }}>
          <form onSubmit={handleBlogSubmit}>
            <div className="mb-4">
              <button type="button" className="btn text-primary p-0" id="create-account" style={{ border: "none" }} onClick={() => navigate("/")}>
                &#8592; Back to home
              </button>
            </div>
            <h4 className="text-primary mb-4 text-center">What's going in your mind?</h4>
            <div className="mb-4">
              <input type="text" className="form-control border-0 border-bottom shadow-none" value={blogTitle} onChange={handleBlogTitle} placeholder="Your title goes here" required />
            </div>
            <div className="mb-4 d-flex flex-row">
              <div className="w-50 me-4">
                <label htmlFor="formFile" className="form-label">Preview image</label>
                <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
              </div>
              <div className="w-50 d-flex flex-column ms-4">
                <label htmlFor="formFile" className="form-label">Category</label>
                <select className="form-select" aria-label="Default select example" value={blogCategory} onClick={handleFetchCategories} onChange={handleSelectedCategory} required >
                  <option >Select your article category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.title}>{category.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="exampleInputPassword1" className="form-label">Write your content</label>
              <Editor
                tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                onInit={(evt, editor) => editorRef.current = editor}
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
              {/* <button onClick={log}>Log editor content</button> */}
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary me-2" onClick={() => setBlogStatus("CREATED")}>
                <span className="spinner-border-sm" id="create-loader" aria-hidden="true"></span>
                <span role="status" id="create-text">Create</span>
              </button>
              <button type="submit" className="btn btn-primary ms-2" onClick={() => setBlogStatus("PUBLISHED")}>
                <span className="spinner-border-sm" id="publish-loader" aria-hidden="true"></span>
                <span role="status" id="publish-text" >Publish</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default WriteBlog;
