import React from "react";
import Loading from "../Components/Loading";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.hotp = React.createRef();
    this.password = React.createRef();
    this.email = React.createRef();
    this.submit = this.submit.bind(this);
    this.unremember = this.unremember.bind(this);
  }

  unremember() {
    Cookies.remove('target');
    this.forceUpdate();
  }

  submit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var qs = "/api/login?email=" + encodeURIComponent(this.email.current.value) +
      "&password=" + encodeURIComponent(this.password.current.value);
    if (Cookies.get('target')) {
      qs += "&target=" + encodeURIComponent(Cookies.get('target'));
    } else {
      qs += "&otp=" + encodeURIComponent(this.hotp.current.value)
    }
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
    if (this.state.success) return <Navigate to={"/remember?target=" + this.state.target} />;

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
          <label htmlFor="email" className="form-label">
            Password
          </label>
          <input
            ref={this.password}
            type="password"
            className="form-control"
            placeholder="Enter your password"
          />
          <div className="form-text mt-1">
            <Link
              to="/recoverpassword"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        {Cookies.get('target') ? <div className="mt-3">
          <label htmlFor="email" className="form-label">
            HOTP code
          </label>
          <div className="input-group m-0">
            <span className="input-group-text">
              <i className="fa fa-circle-check" />
            </span>
            <input
              type="text"
              className="form-control"
              value="Remembered"
              readOnly
            />
            <button
              className="btn btn-outline-secondary"
              onClick={this.unremember}
              type="button"
            >
              <i className="fa fa-times" />
            </button>
          </div>
        </div> : <div className="mt-3">
          <label htmlFor="email" className="form-label">
            HOTP code
          </label>
          <input
            ref={this.hotp}
            type="number"
            className="form-control"
            placeholder="Enter your one-time code"
          />
          <div className="form-text mt-1">
            <Link
              to="/recoverhotp"
            >
              Lost HOTP device?
            </Link>
          </div>
        </div>}
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

export default Login;
