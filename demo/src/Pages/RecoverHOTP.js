import React from "react";
import Loading from "../Components/Loading";
import axios from "axios";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import base32 from 'thirty-two';

class RecoverHOTP extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.rc = React.createRef();
    this.password = React.createRef();
    this.email = React.createRef();
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var qs = "/api/recoverHOTP?email=" + encodeURIComponent(this.email.current.value) +
      "&password=" + encodeURIComponent(this.password.current.value) +
      "&rc=" + encodeURIComponent(this.rc.current.value);

    axios
      .post(qs)
      .then((res) => {
        if (res.data.valid) {
          this.setState({ loading: false, success: true, data: res.data });
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
    if (this.state.success) return <>
      <h2 className="text-center text-success">
        <i className="fa-solid fa-envelope-circle-check"></i>
        &nbsp;&thinsp;HOTP reset!
      </h2>
      <p className="mb-0 mt-3">
        Please scan the following QR code with an app like Google Authenticator to set up your new HOTP device.
      </p>
      <QRCode
        value={"otpauth://hotp/" + this.state.data.email + "?secret=" + base32.encode(Buffer.from(this.state.data.hotpSecret, 'hex')) + "&issuer=MFCHF%20Demo&algorithm=SHA1&digits=6&counter=1"}
        className="qr mt-4 mb-4"
        size={192}
      />
      <Link to="/" class="btn btn-primary w-100 mb-0 mt-3"><i class="fa-solid fa-right-from-bracket"></i>&nbsp; Done</Link>
    </>
    ;

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
        </div>
        <div className="mt-3">
          <label htmlFor="email" className="form-label">
            Recovery code
          </label>
          <input
            ref={this.rc}
            type="text"
            className="form-control"
            placeholder="Enter your recovery code code"
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

export default RecoverHOTP;
