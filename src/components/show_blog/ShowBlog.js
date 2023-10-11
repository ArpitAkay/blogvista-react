import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';
import { useSelector } from 'react-redux';
import Image_not_available from '../../images/Image_not_available.png';

const ShowBlog = (props) => {
  const [blogAuthor, setBlogAuthor] = useState("");
  // eslint-disable-next-line
  const [blogContent, setBlogContent] = useState("");
  const [blogCreatedDate, setBlogCreatedDate] = useState("");
  const [blogPreviewImageUrl, setBlogPreviewImageUrl] = useState("");
  const [blogTitle, setBlogTitle] = useState("");

  const auth = useSelector((state) => state.auth);
  const { blogId } = useParams();

  const loadBlog = async () => {
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
      setBlogAuthor(response.data.author);
      setBlogContent(response.data.content);
      setBlogCreatedDate(response.data.createdDate.split("T")[0]);
      setBlogPreviewImageUrl(response.data.previewImageUrl);
      setBlogTitle(response.data.title);
      document.getElementById("content").innerHTML = response.data.content;
    }
    else {
      props.showToast("Failed", "Error fetching blog");
    }
  }

  useEffect(() => {
    loadBlog();
  // eslint-disable-next-line
  }, []);


  return (
    <div className="d-flex justify-content-center mt-5">
      <div style={{ width: "85%" }}>
        <div>
          <h2 className="text-center"><i>{blogTitle}</i></h2>
          <div className="d-flex justify-content-around mt-2">
            <p><i>{"- " + blogAuthor}</i></p>
            <p><i>{"- " + blogCreatedDate}</i></p>
          </div>
        </div>
        <div className="my-5 d-flex justify-content-center">
          {/* <img src={blogPreviewImageUrl === null ? Image_not_available : blogPreviewImageUrl} class="img-fluid" alt="Error loading" /> */}
          <img src="https://blogvista.s3.ap-south-1.amazonaws.com/1_BQ-yMaG77_Gt3wd8mDUbOQ.webp" class="img-fluid" alt="Error loading" />
        </div>
        <div className="p-4 border border-light shadow-lg bg-body-tertiary rounded-4" id="content">
        </div>
      </div>
    </div>
  )
}

export default ShowBlog
