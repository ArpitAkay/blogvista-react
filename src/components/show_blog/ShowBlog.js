import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker'
import { useSelector } from 'react-redux'
import Spinner from '../spinner/Spinner'
import Footer from '../footer/Footer'
import imageNotAvailable from "../../images/imageNotAvailable.png"

const ShowBlog = (props) => {
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCreatedDate, setBlogCreatedDate] = useState("");
  const [blogPreviewImageUrl, setBlogPreviewImageUrl] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
      setBlogAuthor(response.data.author);
      setBlogContent(response.data.content);
      setBlogCreatedDate(response.data.createdDate.split("T")[0]);
      setBlogPreviewImageUrl(response.data.previewImageUrl);
      setBlogTitle(response.data.title);
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
    <div style={{ width: "100vw", height: "100vh" }}>
      {loading && <div>
        <Spinner />
      </div>}
      {!loading && <div className="d-flex justify-content-center my-5">
        <div style={{ width: "85%" }}>
          <div>
            <h2 className="text-center"><i>{blogTitle}</i></h2>
            <div className="d-flex justify-content-around mt-2">
              <p><i>{"- " + blogAuthor}</i></p>
              <p><i>{"- " + blogCreatedDate}</i></p>
            </div>
          </div>
          <div className="my-5 d-flex justify-content-center">
            <img src={blogPreviewImageUrl === null ? imageNotAvailable : blogPreviewImageUrl} className="img-fluid" alt="Error loading" />
          </div>
          <div className="p-5 border border-light shadow-lg bg-body-tertiary rounded-4" dangerouslySetInnerHTML={{ __html: blogContent }}>
          </div>
        </div>
      </div>}
      <div className="position-sticky" style={{ top: "66%" }}>
        <Footer />
      </div>
    </div>
  )
}

export default ShowBlog
