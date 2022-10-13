import React from "react";
import { Link } from "react-router-dom";

class Success extends React.Component {
  render() {
    return (<>
      <div className="row mb-4 align-items-center">
        <div className="col-3">
          <div className="circle-success">
            <i className="fa fa-check" />
          </div>
        </div>
        <div className="col-9">
          <h4>Success!</h4>
          <p className="mb-0">The authentication server has accepted your credentials. In a production app, the main content would appear here.</p>
        </div>
      </div>
      <Link to="/" class="btn btn-primary w-100 mb-0"><i class="fa-solid fa-right-from-bracket"></i>&nbsp; Log Out</Link>
    </>)
  }
}

export default Success;
