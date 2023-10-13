import React, { useEffect, useRef, useState } from 'react'
import { WebServiceInvokerRest } from "../../util/WebServiceInvoker";
import Image_not_available from '../../images/Image_not_available.png'
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

const EditBlog = (props) => {
    const editorRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [blog, setBlog] = useState("");
    const auth = useSelector((state) => state.auth);
    const [blogTitle, setBlogTitle] = useState("");
    const [blogCategory, setBlogCategory] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogPreviewImage, setBlogPreviewImage] = useState("");
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
        console.log(response);

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
            setBlog(response.data);
            setBlogTitle(response.data.title);
            setBlogContent(response.data.content);
            setBlogCategory(response.data.category);
            setBlogPreviewImage(response.data.previewImageUrl)
        }
        else {
            props.showToast("Failed", "Error fetching blog");
        }
    }

    useEffect(() => {
        loadBlogById();
    }, []);

    const handleUpdateSubmit = async () => {
        const blogData = {}

        if(blog.title !== blogTitle) blogData.title = blogTitle;
        if(blog.category !== blogCategory) blogData.category = blogCategory;
        if(blog.content !== blogContent) blogData.content = blogContent;

        const formData = new FormData();
        formData.append("blogId", blogId);
        formData.append("blogData", JSON.stringify(blogData))
        formData.append("blogPreviewImage", blogPreviewImage)

        const headers = {
            "Authorization": "Bearer " + auth.authToken,
            'Content-Type': 'multipart/form-data'
        };

        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_UPDATE_BLOG_STATUS;

        const response = await WebServiceInvokerRest(
            hostname,
            urlContent,
            "PATCH",
            headers,
            formData,
            null
        );

        if (response.status === 200) {
            props.showToast("Failed", "Blog updated successfully");
        }
        else {
            props.showToast("Failed", "Failed to update the blog");
        }
    }

    const handleBlogTitle = (event) => {
        setBlogTitle(event.target.value);
    }

    const handleSelectedCategory = (event) => {
        setBlogCategory(event.target.value);
    }

    const handleBlogPreviewImage = (event) => {
        setBlogPreviewImage(event.target.files[0]);
    }

    return (
        <>
            <Navbar />
            <div>
                <form onSubmit={handleUpdateSubmit}>
                    <div className="container">
                        <div className="d-flex flex-row justify-content-around">
                            <div className="d-flex flex-column justify-content-center w-25">
                                <label htmlFor="formFile" className="form-label text-center"><h5><i>Preview image</i></h5></label>
                                {/* <input className="form-control" type="file" id="formFile" onChange={{}} /> */}
                                <img src={blogPreviewImage === null ? Image_not_available : blogPreviewImage} class="img-fluid border rounded-4" alt="Error loading"></img>
                            </div>
                            <div className="mt-5">
                                <div className="my-5">
                                    <input type="text" className="form-control border-0 border-bottom shadow-none" placeholder="Your title goes here" required style={{ "fontStyle": "italic" }} value={blogTitle} onChange={handleBlogTitle} />
                                </div>
                                <div className="my-5">
                                    <select className="form-select" aria-label="Default select example" value={blogCategory} onClick={handleFetchCategories} onChange={handleSelectedCategory} required >
                                        <option>Select your article category</option>
                                        {categories.map((category) => (
                                            <option key={category.categoryId} value={category.title}>{category.title}</option>
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
                            <button type="submit" class="btn btn-primary"><i>Update</i></button>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default EditBlog
