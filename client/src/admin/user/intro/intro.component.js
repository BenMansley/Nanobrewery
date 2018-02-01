import React from 'react';
import { Link } from 'react-router-dom';

const Intro = () => {
  return (
    <div className="intro-steps">
      <Link to="/shop/hardware" className="card step hardware">
        <div className="step-flex">
          <div className="step-image"><span className="step-complete material-icons">done</span></div>
          <span className="step-title">Get the Hardware</span>
        </div>
      </Link>
      <span className="step-next material-icons">arrow_forward</span>
      <Link to="/admin/customizer" className="card step make">
        <div className="step-flex">
          <div className="step-image"></div>
          <span className="step-title">Make Your First Beer</span>
        </div>
      </Link>
      <span className="step-next material-icons">arrow_forward</span>
      <Link to="/admin/branding" className="card step brand">
        <div className="step-flex">
          <div className="step-image"><span className="step-incomplete material-icons">clear</span></div>
          <span className="step-title">Brand Your Beer</span>
        </div>
      </Link>
    </div>
  );
}

export default Intro;