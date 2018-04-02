import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CustomizationTable = ({ customizations }) => {
  let customizationLines = [];
  if (customizations.length > 0) {
    customizationLines = customizations.map(c => 
      <div key={c.id} className="customization-line">
        <h2>{c.name}</h2>
        <div className="customization-actions">
          <Link className="button" to={{ pathname: "/admin/customizer", search:`?id=${c.id}` }}>Edit</Link>          
          <Link className="button" to={{ pathname: "/admin/branding", search:`?id=${c.id}` }}>Brand</Link>
        </div>
      </div>
    );
  }
  
  return <div className="customization-table card">{customizationLines}</div>
}

export default CustomizationTable