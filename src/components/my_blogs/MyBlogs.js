import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';
import Footer from '../footer/Footer';
import Swal from 'sweetalert2';
import Pagination from '../pagination/Pagination';
import Blog from '../blog/Blog';
import Spinner from '../spinner/Spinner';

const MyBlogs = (props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  // eslint-disable-next-line 
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);

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
      setLoading(false);
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

  const handlePageChange = (pageNo) => {
    setPageNo(pageNo)
  }

  const deleteBlog = async (blogId) => {
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
        await loadBlogsByEmail();
        props.showToast("Success", response.data);
      }
      else {
        props.showToast("Failed", "Error fetching blogs");
      }
    }
  }

  useEffect(() => {
    loadBlogsByEmail();
    // eslint-disable-next-line 
  }, [pageNo]);

  return (
    <div style={{ width: "100vw", height: "87.3vh" }}>
      <div className="d-flex flex-row justify-content-around mt-5 mb-3">
        <h4 className="text-center"><i>{auth.name + "'s blogs"}</i></h4>
      </div>
      {loading && <div>
        <Spinner />
      </div>}
      {blogs.length === 0 && !loading && <div>
        <p className="text-center"><i>Oh boy! Create your first blog</i></p>
      </div>}
      {blogs.length !== 0 && !loading && <div className="d-flex flex-column justify-content-center align-items-center mx-5 mt-5 mb-3">
        {
          blogs.map(blog => {
            return <Blog showToast={props.showToast} key={blog.blogId} updateDeleteBtn={true} showStatus={true} showCheckoutBtn={true} showPublishBtn={true} blog={blog} deleteBlog={deleteBlog} />
          })
        }
      </div>}
      {blogs.length !== 0 && <div className="d-flex justify-content-center mt-5">
        <Pagination pageNo={pageNo} currentPage={currentPage} hasNext={hasNext} hasPrevious={hasPrevious} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>}
      <div className="position-sticky" style={{ top: "66%" }}>
        <Footer />
      </div>
    </div>
  )
}

export default MyBlogs
