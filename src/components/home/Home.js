import React, { useEffect, useState } from 'react'
import Blog from '../blog/Blog';
import Footer from '../footer/Footer';
import Search from '../search/Search';
import { useSelector } from 'react-redux';
import { WebServiceInvokerRest } from '../../util/WebServiceInvoker';
import Pagination from '../pagination/Pagination';
import Spinner from '../spinner/Spinner';
import SearchResultList from '../search_results_list/SearchResultList';

const Home = (props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  // eslint-disable-next-line
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedBlogResults, setSearchedBlogResults] = useState([]);
  const [searchedCurrentPage, setSearchedCurrentPage] = useState(0);
  const [searchedHasNext, setSearchedHasNext] = useState(false);
  const [searchedHasPrevious, setSearchedHasPrevious] = useState(false);
  const [searchedTotalPages, setSearchedTotalPages] = useState(0);
  const [searchedPagination, setSearchedPagination] = useState(false);
  const auth = useSelector((state) => state.auth);

  const loadBlogs = async () => {
    const pageParams = {
      pageNo: pageNo,
      pageSize: 5,
    }

    if(searchedPagination) pageParams.query = searchText;

    const headers = {
      "Authorization": "Bearer " + auth.authToken
    };

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + (searchedPagination ? process.env.REACT_APP_SEARCH_BLOGS : process.env.REACT_APP_GET_ALL_BLOGS);

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "GET",
      headers,
      null,
      pageParams
    );

    if (response.status === 200) {
      setLoading(false);
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

  const handlePageChange = (pageNo) => {
    setPageNo(pageNo);
  }

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line
  }, [pageNo])

  const searchBlogs = async (searchValue) => {
    const searchParams = {
      pageNo: 1,
      pageSize: 5,
      query: searchValue
    }

    const headers = {
      "Authorization": "Bearer " + auth.authToken
    };

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_BLOG_ENDPOINT + process.env.REACT_APP_SEARCH_BLOGS;

    const response = await WebServiceInvokerRest(
      hostname,
      urlContent,
      "GET",
      headers,
      null,
      searchParams
    );

    if (response.status === 200) {
      setSearchedCurrentPage(response.data.currentPage);
      setSearchedHasNext(response.data.hasNext);
      setSearchedHasPrevious(response.data.hasPrevious);
      setSearchedTotalPages(response.data.totalPages);
      setSearchedBlogResults(response.data.blogs);
    }
    else {
      props.showToast("Failed", "Error fetching blogs");
    }
  }

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);

    if (event.target.value.length >= 4) {
      setSearchedPagination(false);
      searchBlogs(event.target.value);
    }
    else {
      setSearchedBlogResults([]);
    }
  }

  const handleSearchSubmit = (event) => {
    console.log("handleSearchSubmit");
    setLoading(true);
    setSearchedPagination(true);
    event.preventDefault();
    setBlogs(searchedBlogResults);
    setCurrentPage(searchedCurrentPage);
    setHasNext(searchedHasNext);
    setHasPrevious(searchedHasPrevious);
    setTotalPages(searchedTotalPages);
    setLoading(false);
  }

  return (
    <div style={{ width: "100vw", height: "93.2vh" }}>
      {blogs.length !== 0 && !loading && <div className="mt-5 d-flex flex-column align-items-center">
        <Search searchText={searchText} handleSearchChange={handleSearchChange} handleSearchSubmit={handleSearchSubmit} />
        {!searchedPagination && <SearchResultList searchedBlogResults={searchedBlogResults} />}
      </div>}
      {loading && <div>
        <Spinner />
      </div>}
      {blogs.length === 0 && !loading && <div>
        <p className="text-center pt-5"><i>Oh boy! No blog created yet, be the first one to create</i></p>
      </div>}
      {blogs.length !== 0 && !loading && <div className="d-flex flex-column justify-content-center align-items-center mt-5 mx-2">
        {
          blogs.map((blog) => {
            return <Blog key={blog.blogId} updateDeleteBtn={false} showStatus={false} showCheckoutBtn={true} showPublishBtn={false} blog={blog} />
          })
        }
      </div>}
      {blogs.length !== 0 && !loading && <div className="d-flex justify-content-center mt-5">
        <Pagination pageNo={pageNo} currentPage={currentPage} hasNext={hasNext} hasPrevious={hasPrevious} pageSize={pageSize} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>}
      <div className="position-sticky" style={{ top: "66%" }}>
        <Footer />
      </div>
    </div>
  )
}

export default Home;
