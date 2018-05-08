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
            <p className="large">Welcome to NanoBrewery!</p>
            <p>Welcome to Nanobrewery - the place where you can design a beer to your own specifications (or just
              pick one from our standard list) and have it ready to sell in your own premises just 10 days later.
              You can make that beer light or dark, really effervescent or not, choose how much alcohol it should
              contain and how hoppy you would like it. In fact, we estimate that there around 5-8,000 tasty
              combinations - so many that we haven't been able to try them all yet!<br />Add to that, you can give
              your beer a unique name, design a pump clip, beer mats, glasses or towels and have them all delivered
              with the beer: everything you need to offer your customers a unique experience and help you stand out
              from the crowd.</p>
            <p className="large">How Do We Do It?</p>
            <div className="flex-container">
              <div className="img" />
              <p>It's easy and we take care of it all for you. You sign up to have a fermentation kit fitted on your
                premises,then design your beer and marketing materials here. 3-4 days later we deliver you the mash
                and you simply drop the entire bag into the fermentation unit - we manage everything for you remotely.
                When the beer's ready, you'll get a message and you can tap off the beer into a cask. Simply wash out
                the unit and you're good to go again (you can even have the empty mash bag picked up when your next
                delivery arrives so there's no waste to deal with).<br />If you love what you made, the recipe is in
                your account to re-order, or you can try something else. Test it out on your regulars and adjust the
                flavour based on their comments: a great way to tailor your product and an excellent opportunity
                to build rapport with your customers.
              </p>
            </div>
            <Link className="button" to="/authentication/signup">Sign Up Now!</Link>
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
