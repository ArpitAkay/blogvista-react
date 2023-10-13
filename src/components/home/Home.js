import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar';
import Blog from '../blog/Blog';
import Footer from '../footer/Footer';
import Search from '../search/Search';
import { useSelector } from 'react-redux';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';
import { Link } from 'react-router-dom';

const Home = (props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  // eslint-disable-next-line
  const [totalPages, setTotalPages] = useState(0);
  const [blogs, setBlogs] = useState([]);

  const [page, setPage] = useState(0);
  const [pagesToShow, setPagesToShow] = useState(1);

  const auth = useSelector((state) => state.auth);

  const loadBlogs = async () => {
    const requestParams = {
      pageNo: page,
      pageSize: 5,
    }

    const headers = {
      "Authorization": "Bearer " + auth.authToken
    };

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_GET_ALL_BLOGS;

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
      setTotalPages(response.data.totalPages);
      setBlogs(response.data.blogs);
    }
    else {
      props.showToast("Failed", "Error fetching blogs");
    }
  }

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line
  }, [page])

  const renderPaginationLinks = () => {
    const links = [];
    for (let i = pagesToShow; i <= pagesToShow + 2; i++) {
      links.push(
        <li className={`page-item ${i === (currentPage + 1) ? "active" : ""}`} key={i}>
          <Link className="page-link" value={i} onClick={handleChangePageClick}>{i}</Link>
        </li>
      );
    }

    return links;
  }

  const handleHasPreviousClick = () => {
    setPage(page - 1);
    if (page % 3 === 0) {
      setPagesToShow(pagesToShow - 1);
    }
  };

  const handleChangePageClick = (event) => {
    setPage(event.target.getAttribute('value') - 1);
  }

  const handleHasNextClick = () => {
    setPage(page + 1);
    if ((page + 1) % 3 === 0) {
      setPagesToShow(pagesToShow + 1);
    }
  };


  return (
    <div style={{ width: "100vw"}}>
      <Navbar />
      <Search />
      <div className="d-flex flex-column justify-content-center mt-5">
        {
          blogs.map((blog) => {
            return <Blog key={blog.blogId} blog={blog} />
          })
        }
      </div>

      <div className="d-flex justify-content-center my-4">
        <nav aria-label="...">
          <ul className="pagination">
            <li className={`page-item ${hasPrevious ? "" : "disabled"}`} >
              <Link className="page-link" onClick={handleHasPreviousClick}>Previous</Link>
            </li>

            {renderPaginationLinks()}

            <li className={`page-item ${hasNext ? "" : "disabled"}`}>
              <Link className="page-link" onClick={handleHasNextClick}>Next</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Footer />
    </div>
  )
}

export default Home;
