import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from 'react-redux';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';
import Footer from '../footer/Footer';
import './WriteBlog.css'
import uploadImage from '../../images/uploadImage.webp'

const WriteBlog = (props) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogPreviewImage, setBlogPreviewImage] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogStatus, setBlogStatus] = useState("");
  const [blogCategoryImageBase64, setBlogCategoryImageBase64] = useState(uploadImage);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const auth = useSelector((state) => state.auth);

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
    const file = event.target.files[0];
    setBlogPreviewImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBlogCategoryImageBase64(reader.result);
    }
  }

  const handleSelectedCategory = (event) => {
    setBlogCategory(event.target.value);
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

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
    if(blogPreviewImage !== "") formData.append("blogPreviewImage", blogPreviewImage);

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
      setBlogCategoryImageBase64(uploadImage);
      setBlogCategory("");
      editorRef.current.setContent("");
      props.showToast("Success", "Blog created successfully");
    }
    else {
      props.showToast("Failed", "Error creating blog, please try again later");
    }
    setLoading(false);
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
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="my-5">
        <div className="d-flex flex-row justify-content-center">
          <div className="rounded-4 p-5 shadow" style={{ width: "80%" }}>
            <form onSubmit={handleBlogSubmit}>
              <div>
                <h4 className="text-center"><i>What's going in your mind?</i></h4>
              </div>
              <div className="mt-5 d-flex flex-row justify-content-center">
                <input type="text" className="form-control border-0 border-bottom shadow-sm text-center" value={blogTitle} onChange={handleBlogTitle} placeholder="Your title goes here" required style={{ fontStyle: "italic" }} />
              </div>
              <div className="my-3 d-flex flex-column align-items-center">
                <label htmlFor="formFile" className="form-label text-center my-3"><i><big>Preview image</big></i></label>
                <div className="w-75 d-flex justify-content-center">
                  <img src={blogCategoryImageBase64} class="img-fluid" style={{ maxWidth: "400px", maxHeight: "200px" }} id="preview-image" onClick={() => document.getElementById("formFile").click()} alt="Error loading"/>
                  <input className="form-control w-50" hidden type="file" id="formFile" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>
              <div className="my-5 d-flex justify-content-center">
                <select className="form-select w-50 fst-italic shadow-sm" aria-label="Default select example" value={blogCategory} onClick={handleFetchCategories} onChange={handleSelectedCategory} required >
                  <option className="text-center"><i>Select your blog category</i></option>
                  {categories.map((category) => (
                    <option className="text-center" key={category.categoryId} value={category.title}>{category.title}</option>
                  ))}
                </select>
              </div>
              <div className="mt-5 mb-4">
                <div className="text-center my-2">
                  <label htmlFor="exampleInputPassword1" className="form-label"><i><big>Write your content</big></i></label>
                </div>
                <div className="shadow-sm">
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
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success btn-sm me-2" onClick={() => setBlogStatus("CREATED")} disabled={loading}>
                  <span className="spinner-border-sm" id="create-loader" aria-hidden="true"></span>
                  <span role="status" id="create-text"><i>Create</i></span>
                </button>
                <button type="submit" className="btn btn-danger btn-sm ms-2" onClick={() => setBlogStatus("PUBLISHED")} disabled={loading}>
                  <span className="spinner-border-sm" id="publish-loader" aria-hidden="true"></span>
                  <span role="status" id="publish-text" ><i>Publish</i></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default WriteBlog;
