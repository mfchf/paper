import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './index.scss';
import reportWebVitals from './reportWebVitals';

import icon from "./Images/icon-w.png";

import Success from "./Pages/Success";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Remember from "./Pages/Remember";
import RecoverHOTP from "./Pages/RecoverHOTP";
import RecoverPassword from "./Pages/RecoverPassword";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="splash-bg">
      <div className="bg-image"></div>
      <div className="form text-center">
        <img className="logo" src={icon} alt="MFKDF" />
        <div className="card text-start">
          <Router>
            <Routes>
              <Route path="/success" element={<Success />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/remember" element={<Remember />} />
              <Route path="/recoverhotp" element={<RecoverHOTP />} />
              <Route path="/recoverpassword" element={<RecoverPassword />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </div>
      </div>
      <div className="warning">
        <i className="fa fa-triangle-exclamation"></i>&nbsp; This application
        is for demo purposes only.
      </div>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
