import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// import Intro from "./admin/user/intro/intro.component";
import { getCustomizations } from "./admin/branding/branding.actions";
import CustomizationTable from "./components/customization-table/customization-table.component";

class Home extends Component {
  componentDidMount() {
    const { isLoggedIn, getCustomizations } = this.props;
    if (isLoggedIn) {
      getCustomizations();
    }
  }

  componentDidUpdate(prevProps) {
    const { isLoggedIn, getCustomizations } = this.props;
    if (isLoggedIn && !prevProps.isLoggedIn) {
      getCustomizations();
    }
  }

  render() {
    const { isLoggedIn, customizations } = this.props;

    return (
      <div className="page-content">
        <h1>Nanobrewery Home Page</h1>
        { isLoggedIn
          ? <React.Fragment>
            <CustomizationTable customizations={customizations} />
            {/* { customizations.length === 0 ? <Intro/> : <div>{customizations}</div> } */}
          </React.Fragment>
          : null }
      </div>
    );
  }
}

Home.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  customizations: PropTypes.array,
  getCustomizations: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    customizations: state.branding.customizations
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomizations: () => dispatch(getCustomizations())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
