import React, { useEffect, useRef, useState } from 'react'
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker'
import imageNotAvailable from '../../images/imageNotAvailable.png'
import { Editor } from '@tinymce/tinymce-react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Footer from '../footer/Footer'
import './EditBlog.css'
import Spinner from '../spinner/Spinner'

const EditBlog = (props) => {
    const editorRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [blog, setBlog] = useState("");
    const auth = useSelector((state) => state.auth);
    const [blogTitle, setBlogTitle] = useState("");
    const [blogCategory, setBlogCategory] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogPreviewImage, setBlogPreviewImage] = useState("");
    const [blogPreviewImageBase64, setBlogPreviewImageBase64] = useState(imageNotAvailable);
    const [isBlogPreviewImageChanged, setIsBlogPreviewImageChanged] = useState(false);
    const [blogloading, setBlogLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { blogId } = useParams();

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

        if (response.status === 200) {
            setCategories(response.data);
        }
        else {
            props.showToast("Failed", "Error loading categories");
        }
    }

    const loadBlogById = async () => {
        const requestParams = {
            blogId: blogId
        }

        const headers = {
            "Authorization": "Bearer " + auth.authToken
        };

        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_GET_BLOG_BY_ID;

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "GET",
            headers,
            null,
            requestParams
        );

        if (response.status === 200) {
            setBlogLoading(false);
            setBlog(response.data);
            setBlogTitle(response.data.title);
            setBlogContent(response.data.content);
            setBlogCategory(response.data.category);
            response.data.previewImageUrl === null ? setBlogPreviewImageBase64(imageNotAvailable) :
                setBlogPreviewImageBase64(response.data.previewImageUrl);
        }
        else {
            props.showToast("Failed", "Error fetching blog");
        }
    }

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
        setSubmitLoading(true);
        const blogData = {}

        if (blog.title !== blogTitle) blogData.title = blogTitle;
        if (blog.category !== blogCategory) blogData.category = blogCategory;
        if (blog.content !== editorRef.current.getContent()) blogData.content = editorRef.current.getContent();

        if(Object.keys(blogData).length === 0  && !isBlogPreviewImageChanged) {
            props.showToast("Failed", "Nothing to update");
            return;
        }

        const formData = new FormData();
        formData.append("blogId", blogId);
        formData.append("blogData", JSON.stringify(blogData));
        if(isBlogPreviewImageChanged) formData.append("blogPreviewImage", blogPreviewImage);

        const headers = {
            "Authorization": "Bearer " + auth.authToken,
            'Content-Type': 'multipart/form-data'
        };

        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_UPDATE_BLOG_BY_ID;

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "PATCH",
            headers,
            formData,
            null
        );

        if (response.status === 200) {
            setBlog(response.data);
            setBlogTitle(response.data.title);
            setBlogContent(response.data.content);
            setBlogCategory(response.data.category);
            response.data.previewImageUrl === null ? setBlogPreviewImageBase64(imageNotAvailable) :
                setBlogPreviewImageBase64(response.data.previewImageUrl);
            props.showToast("Success", "Blog updated successfully");
        }
        else {
            props.showToast("Failed", "Failed to update the blog");
        }
        setSubmitLoading(false);
    }

    const handleBlogTitle = (event) => {
        setBlogTitle(event.target.value);
    }

    const handleSelectedCategory = (event) => {
        setBlogCategory(event.target.value);
    }

    const handleBlogPreviewImage = (event) => {
        setIsBlogPreviewImageChanged(true);
        const file = event.target.files[0];
        setBlogPreviewImage(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setBlogPreviewImageBase64(reader.result);
        }
    }

    useEffect(() => {
        loadBlogById();
        // eslint-disable-next-line
    }, []);

    return (
        <div style={{ width: "100vw", height: "93vh" }}>
            {blogloading && <div>
                <Spinner />
            </div>}
            {!blogloading && <div>
                <form onSubmit={handleUpdateSubmit}>
                    <div className="container">
                        <div className="d-flex flex-row justify-content-around">
                            <div className="d-flex flex-column justify-content-center w-25">
                                <label htmlFor="formFile" className="form-label text-center"><h5><i>Preview image</i></h5></label>
                                <img src={blogPreviewImageBase64} className="img-fluid border rounded-4" id="edit-preview-image" onClick={() => document.getElementById("formFile").click()} style={{ maxWidth: "325px", maxHeight: "200px" }} alt="Error loading"></img>
                                <input className="form-control" type="file" accept="image/*" id="formFile" onChange={handleBlogPreviewImage} hidden />
                            </div>
                            <div className="mt-5">
                                <div className="my-5">
                                    <input type="text" className="form-control border-0 border-bottom shadow-none text-center" placeholder="Your title goes here" required style={{ "fontStyle": "italic" }} value={blogTitle} onChange={handleBlogTitle} />
                                </div>
                                <div className="my-5">
                                    <select className="form-select fst-italic" aria-label="Default select example" onClick={handleFetchCategories} onChange={handleSelectedCategory} required >
                                        <option className="text-center">{blogCategory}</option>
                                        {categories.map((category) => (
                                            blogCategory !== category.title &&
                                            <option className="text-center" key={category.categoryId} value={category.title} selected={category.title === blogCategory}>{category.title} </option>

                                        ))}
                                    </select>
                                </div>
                                <div className="my-5">
                                    <Editor
                                        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        initialValue={blogContent}
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
                        </div>
                        <div className="d-flex justify-content-center mb-5">
                            <button type="submit" className="btn btn-primary" disabled={submitLoading || blogTitle.trim().length === 0 }>
                                <span className={`${submitLoading ? "spinner-border" : ""} spinner-border-sm`} aria-hidden="true"></span>
                                <span className={submitLoading ? "visually-hidden" : ""} role="status"><i>Update</i></span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>}
            <div className="position-sticky" style={{ top: "66%" }}>
                <Footer />
            </div>
        </div>
    )
}

export default EditBlog
