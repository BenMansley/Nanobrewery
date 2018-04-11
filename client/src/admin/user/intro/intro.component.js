import React from "react";
import { Link } from "react-router-dom";
import mugImage from "../../../img/mug.svg";

const Intro = () => {
  return (
    <div className="intro">
      <h2>First Steps</h2>
      <div className="intro-steps">
        <Link to="/admin/shop/hardware" className="card step hardware">
          <div className="step-flex">
            <div className="step-image">
              <span className="step-complete material-icons">done</span>
              <span>Done!</span>
            </div>
            <span className="step-title">Get the Hardware</span>
          </div>
        </Link>
        <span className="step-next material-icons">arrow_forward</span>
        <Link to="/admin/customizer" className="card step make">
          <div className="step-flex">
            <div className="step-image">
              <img className="step-incomplete" src={mugImage} alt="mug" />
            </div>
            <span className="step-title">Make Your First Beer</span>
          </div>
        </Link>
        <span className="step-next material-icons">arrow_forward</span>
        <Link to="/admin/branding" className="card step brand">
          <div className="step-flex">
            <div className="step-image">
              <span className="step-incomplete material-icons">clear</span>
            </div>
            <span className="step-title">Brand Your Beer</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Intro;
