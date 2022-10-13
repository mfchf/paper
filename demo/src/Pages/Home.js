import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (<>
      <h3 className="text-center">MFCHF Demo</h3>
      <p className="mt-3">
        This is a demo of the multi-factor credential hashing function (MFCHF), which incorporates HOTP into the password hash to improve resistance to brute-force attacks (mfchf-pbkdf2-hotp6). It features support for account recovery if either factor is lost, as well as support for an HOTP window and factor persistence.
      </p>
      <div className="row">
        <div className="col-6">
          <Link to="/register" className="btn btn-success m-0 mt-2 w-100">
            <i className="fa fa-user-plus" />
            &nbsp; Sign Up
          </Link>
        </div>
        <div className="col-6">
          <Link to="/login" className="btn btn-light m-0 mt-2 ms-2 w-100">
            <i className="fa fa-right-to-bracket" />
            &nbsp; Log In
          </Link>
        </div>
      </div>
    </>)
  }
}

export default Home;
