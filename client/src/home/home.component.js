import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Intro from "../admin/user/intro/intro.component";
import { getCustomizations } from "../admin/branding/branding.actions";
import CustomizationTable from "../components/customization-table/customization-table.component";

import LogoImage from "../img/logo.svg";
import CheersImage from "../img/cheers.svg";

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
      <div className="page-content homepage">
        <img className="logo-image" src={LogoImage} alt="The Nanobrewery Company" />
        { isLoggedIn
          ? <React.Fragment>
            { isLoadingCustomizations ? <span className="loading spin material-icons">toys</span>
              : customizations.length === 0 ? <Intro />
                : <div className="admin">
                  <div className="title-bar">
                    <h2>Your Beers</h2>
                    <Link className="button new" to="/admin/customizer">New Beer</Link>
                  </div>
                  <CustomizationTable customizations={customizations} />
                </div>
            }
          </React.Fragment>
          : <div className="guest">
            <p className="large">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Ut at nisl vel magna porta consectetur.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at nisl vel magna porta consectetur.
              Phasellus sed aliquam sem, a rutrum massa. Duis eu rutrum tellus, ac gravida lectus. Ut nec tempus elit,
              maximus dignissim dui. Donec sagittis consectetur eleifend. Nulla non est dictum, tincidunt tellus non,
              facilisis felis. Nam lacinia purus eu dapibus lobortis. Proin pulvinar, nisi vel tincidunt elementum,
              massa tortor dictum lorem, sit amet suscipit sapien odio quis metus. Donec sit amet augue lacus.
              Cras tincidunt et nibh et feugiat. Phasellus tempor leo nec quam consectetur aliquet. Interdum et
              malesuada fames ac ante ipsum primis in faucibus. Sed vehicula non ligula quis facilisis. Donec rutrum
              nisl at ultrices maximus. Vivamus augue leo, eleifend ac libero eget, gravida pharetra tortor.
              Nam ornare leo vel auctor sagittis.
            </p>
            <p className="large">How It Works</p>
            <div className="flex-container">
              <div className="img" />
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at nisl vel magna porta consectetur.
                Phasellus sed aliquam sem, a rutrum massa. Duis eu rutrum tellus, ac gravida lectus. Ut nec tempus elit,
                maximus dignissim dui. Donec sagittis consectetur eleifend. Nulla non est dictum, tincidunt tellus non,
                facilisis felis. Nam lacinia purus eu dapibus lobortis. Proin pulvinar, nisi vel tincidunt elementum,
                massa tortor dictum lorem, sit amet suscipit sapien odio quis metus. Donec sit amet augue lacus.
                Cras tincidunt et nibh et feugiat. Phasellus tempor leo nec quam consectetur aliquet.
              </p>
            </div>
            <Link className="button" to="/admin/customizer">Make Your Own!</Link>
            <img className="cheers-image" src={CheersImage} alt="Cheers!" />
          </div>
        }
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
