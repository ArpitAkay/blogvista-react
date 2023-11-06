import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Pagination = (props) => {
    const [pagesToShow, setPagesToShow] = useState(1);

    const renderPaginationLinks = () => {
        const links = [];
        for (let i = 1; i <= pagesToShow; i++) {
            links.push(
                <li className={`page-item ${i === (props.currentPage + 1) ? "active" : ""}`} key={i}>
                    <Link className="page-link" value={i} onClick={() => handleChangePageClick(i)}>{i}</Link>
                </li>
            );
        }

        return links;
    }

    const handleChangePageClick = (pageNo) => {
        props.onPageChange(pageNo - 1);
    }

    const handlePreviousClick = () => {
        if (props.pageNo % 3 === 0 && props.hasPrevious) {
            setPagesToShow(pagesToShow - 1);
        }
        props.onPageChange(props.pageNo - 1);
    }

    const handleNextClick = () => {
        if ((props.pageNo + 1) % 3 === 0 && props.hasNext) {
            setPagesToShow(pagesToShow + 1);
        }
        props.onPageChange(props.pageNo + 1);
    }

    const loadPagesToShow = () => {
        if(props.totalPages < 3) {
            setPagesToShow(props.totalPages);
        }
        else {
            setPagesToShow(3);
        }
    }

    useEffect(() => {
        loadPagesToShow();
        // eslint-disable-next-line 
    }, [])

    return (
        <div>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={`page-item ${props.hasPrevious ? "" : "disabled"}`}><Link className="page-link" to="#" onClick={handlePreviousClick}>Previous</Link></li>
                    {renderPaginationLinks()}
                    <li className={`page-item ${props.hasNext ? "" : "disabled"}`}><Link className="page-link" to="#" onClick={handleNextClick}>Next</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Pagination
