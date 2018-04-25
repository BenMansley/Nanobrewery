import React from "react";
import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div className="no-match page-content">
      <h2>Page Not Found</h2>
      <Link to="/" className="button">Back to homepage</Link>
    </div>
  );
};

export default NoMatch;
