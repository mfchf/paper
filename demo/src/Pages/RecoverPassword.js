import React from "react";
import Loading from "../Components/Loading";
import axios from "axios";
import { Navigate } from "react-router-dom";

class RecoverPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.hotp = React.createRef();
    this.password = React.createRef();
    this.email = React.createRef();
    this.rc = React.createRef();
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var qs = "/api/recoverPassword?email=" + encodeURIComponent(this.email.current.value) +
      "&newpass=" + encodeURIComponent(this.password.current.value) +
      "&rc=" + encodeURIComponent(this.rc.current.value) +
      "&otp=" + encodeURIComponent(this.hotp.current.value);
    axios
      .post(qs)
      .then((res) => {
        if (res.data.valid) {
          this.setState({ loading: false, success: true, data: res.data, target: res.data.target });
        } else {
          this.setState({ loading: false, success: false, data: res.data,
          error: 'One or more factors were incorrect.' });
        }
      })
      .catch((err) => {
        const msg =
          err.response && err.response.data ? err.response.data : err.message;
        this.setState({
          loading: false,
          error: msg,
          emailValid: false,
          nameValid: false,
        });
      });
  }

  render() {
    if (this.state.loading) return <Loading />;
    if (this.state.success) return <Navigate to="/success" />;

    return (<>
      <form action="" onSubmit={this.submit}>
        <div className="mt-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            ref={this.email}
            placeholder="Enter your email"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="rc" className="form-label">
            Recovery code
          </label>
          <input
            ref={this.rc}
            type="text"
            className="form-control"
            placeholder="Enter your recovery code"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="email" className="form-label">
            New password
          </label>
          <input
            ref={this.password}
            type="password"
            className="form-control"
            placeholder="Choose your new password"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="email" className="form-label">
            HOTP code
          </label>
          <input
            ref={this.hotp}
            type="number"
            className="form-control"
            placeholder="Enter your one-time code"
          />
        </div>
        <button
          className="btn btn-success mt-3 mb-0 w-100"
          type="submit"
        >
          Continue &nbsp;
          <i className="fa fa-arrow-right" />
        </button>
      </form>
      {this.state.error && (
        <div
          className="alert alert-danger mt-3 mb-0"
          role="alert"
        >
          <i className="fa fa-triangle-exclamation"></i>&nbsp;{" "}
          <b>Error: </b>
          {this.state.error}
        </div>
      )}
    </>);
  }
}

export default RecoverPassword;
