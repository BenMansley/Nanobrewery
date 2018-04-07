import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Intro from "./admin/user/intro/intro.component";
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
    const { isLoggedIn, customizations, isLoadingCustomizations } = this.props;

    return (
      <div className="page-content">
        <h1>Nanobrewery Home Page</h1>
        { isLoggedIn
          ? <React.Fragment>
            { isLoadingCustomizations ? <span />
              : customizations.length === 0 ? <Intro />
                : <div>
                  <h2>Your Beers</h2>
                  <CustomizationTable customizations={customizations} />
                </div>
            }
          </React.Fragment>
          : null /* Guest home page */}
      </div>
    );
  }
}

Home.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  customizations: PropTypes.array,
  isLoadingCustomizations: PropTypes.bool.isRequired,
  getCustomizations: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    customizations: state.branding.customizations,
    isLoadingCustomizations: state.branding.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomizations: () => dispatch(getCustomizations())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
