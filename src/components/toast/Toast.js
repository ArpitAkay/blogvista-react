import React from 'react'

const Toast = (props) => {

    return (
        props.toast && <div className="toast-container position-fixed bottom-0 start-0 p-3">
            <div id="liveToast" className="toast fade show bg-primary-subtle" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <strong className={`me-auto ${props.heading === 'Success' ? 'text-success' : 'text-danger'}`}>{props.heading}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    {props.message}
                </div>
            </div>
        </div>
    )
}

export default Toast
