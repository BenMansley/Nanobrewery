import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCustomizations } from "./branding.actions";
import MaterialSelect from "../../components/material-select.component";
import BeerImage from "./beer-image.component";
import MaterialInput from "../../components/material-input.component";
import { addProductToBasket } from "../shop/shop.actions";
const imageOptions = [{ value: 0, text: "Custom" }, { value: 1, text: "Pilsen" }, { value: 2, text: "Ale" }];
const imageTypes = ["pilsen", "ale"];

class Branding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isEditingName: false,
      name: "",
      image: 0,
      customImage: "",
      quantity: 140
    };
  }

  setIndex(searchString, customizations) {
    const id = /\?id=(\d+)/.exec(searchString)[1];
    const index = customizations.findIndex(c => c.id === Number(id));
    if (index !== -1) {
      this.setState({ index, quantity: 0 });
    }
  }

  componentDidMount() {
    const { location, customizations, getCustomizations } = this.props;
    if (customizations.length === 0) {
      getCustomizations();
    } else if (location.search) {
      this.setIndex(location.search, customizations);
    }
  }

  componentWillReceiveProps(nextProps) {
    const location = this.props.location;
    if (location.search && (nextProps.customizations.length !== 0)) {
      this.setIndex(location.search, nextProps.customizations);
    }
  }

  onCustomImageChange(event) {
    const file = event.target.files[0];
    if (file.size < 10485760) {
      this.setState({ customImage: window.URL.createObjectURL(file) });
    }
  }

  onBeerSelect(i) {
    this.setState({ index: i });
  }

  onAddToBasket() {
    const { quantity, index } = this.state;
    if (quantity < 1) return;
    const { customizations, addToBasket } = this.props;
    const customizationId = customizations[index].id;
    addToBasket(quantity, customizationId);
  }

  render() {
    const { name, isEditingName, index, image, customImage, quantity } = this.state;
    const { customizations, isLoadingCustomizations, isLoadingBasket } = this.props;
    let beer = null;
    let options = null;

    if (customizations) {
      if (customizations.length > 0) {
        beer = customizations[index];
      }
      if (customizations.length > 1) {
        options = customizations.map((c, i) => {
          return { value: i, text: c.name };
        });
      }
    }

    return (
      <div className="page-content branding">
        <div className="title-bar">
          <h1 className="page-title inline">Brand Your Beer</h1>
          { options
            ? <MaterialSelect options={options} selected={index} onSelect={(i) => this.onBeerSelect(i)} />
            : null }
        </div>
        { beer
          ? <div>
            <div className="card beer">
              { isEditingName
                ? <div>
                  <MaterialInput type="text" id="beer-name" labelText="Name" active={name !== ""} inline
                    onChange={(event) => this.setState({ name: event.target.value })} value={name} />
                  <button onClick={() => this.setState({ isEditingName: false })}>Done</button>
                </div>
                : <div>
                  <h2 className="beer-name">{beer.name}</h2>
                  <button onClick={() => this.setState({ isEditingName: true, name: beer.name })}>Edit Name</button>
                </div>
              }
              <p>{beer.description}</p>
              <ul>
                <li>Volume: {beer.volume}</li> <li>Colour: {beer.colour}</li>
                <li>Hoppiness: {beer.hoppiness}</li> <li>Malt Flavour: {beer.maltFlavour}</li>
              </ul>
              <hr />
              <h3>Make a Logo</h3>
              <div className="beer-flex">
                <div className="beer-image-options">
                  <MaterialSelect options={imageOptions} selected={image}
                    onSelect={(i) => this.setState({ image: i })} />
                </div>
                { image === 0
                  ? <div className="custom-image">
                    <input type="file" accept="image/*" onChange={(event) => this.onCustomImageChange(event)} />
                    { customImage ? <img src={customImage} alt={beer.name} /> : null }
                  </div>
                  : <BeerImage type={imageTypes[image - 1]} text={beer.name} />
                }
              </div>
              <hr />
              <h3>Order your Beer</h3>
              <div className="product-base">
                <label htmlFor="quantity">Quantity: </label>
                <input id="quantity" type="number" className="quantity-input" value={quantity}
                  onChange={(event) => this.setState({ quantity: event.target.value })} />
                <span>pints</span>
                { isLoadingBasket
                  ? <span className="loading spin material-icons">toys</span>
                  : <button className="product-add" onClick={() => this.onAddToBasket()}>Add to Basket</button>
                }
              </div>
            </div>
          </div>
          : null }
        { isLoadingCustomizations
          ? <span className="loading spin material-icons">toys</span>
          : customizations.length === 0
            ? <p className="none-found">You haven"t made any beers. <Link to="/admin/customizer">Make one now?</Link>
            </p> : null}
      </div>
    );
  }
}

Branding.propTypes = {
  customizations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      volume: PropTypes.number,
      colour: PropTypes.number,
      hoppiness: PropTypes.number,
      maltFlavour: PropTypes.number
    })
  ),
  isLoadingCustomizations: PropTypes.bool.isRequired,
  isLoadingBasket: PropTypes.bool.isRequired,
  getCustomizations: PropTypes.func.isRequired,
  addToBasket: PropTypes.func.isRequired,
  location: PropTypes.object
};

const mapStateToProps = state => {
  return {
    customizations: state.branding.customizations,
    isLoadingCustomizations: state.branding.isLoading,
    isLoadingBasket: state.shop.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomizations: () => dispatch(getCustomizations()),
    addToBasket: (quantity, customizationId) => dispatch(addProductToBasket(1, quantity, customizationId))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Branding));
