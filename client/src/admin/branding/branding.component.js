import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCustomizations, editCustomizationDetails } from "./branding.actions";
import MaterialSelect from "../../components/material-select.component";
import BeerImage from "./beer-image.component";
import MaterialInput from "../../components/material-input.component";
import { addProductToBasket } from "../shop/shop.actions";
import MaterialTextarea from "../../components/material-textarea.component";
const imageOptions = [{ value: 0, text: "Custom" }, { value: 1, text: "Pilsen" }, { value: 2, text: "Ale" }];
const imageTypes = ["pilsen", "ale"];

class Branding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      isEditing: false,
      name: "",
      description: "",
      rgb: "",
      imageType: 0,
      customImage: "",
      quantity: 140
    };
  }

  setIndex(searchString, customizations) {
    const id = /\?id=(\d+)/.exec(searchString)[1];
    const index = customizations.findIndex(c => c.id === Number(id));
    if (index !== -1) {
      this.setState({ quantity: 0 });
      this.onBeerSelect(index, customizations);
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
    const { location, customizations } = this.props;
    if (location.search && (nextProps.customizations.length !== 0 && customizations.length === 0)) {
      this.setIndex(location.search, nextProps.customizations);
    } else if (nextProps.customizations.length !== 0 && customizations.length === 0) {
      this.onBeerSelect(0, nextProps.customizations);
    }
  }

  onCustomImageChange(event) {
    const file = event.target.files[0];
    if (file.size < 10485760) {
      this.setState({ customImage: window.URL.createObjectURL(file) });
    }
  }

  onEditClick(beer) {
    this.setState(prevState => {
      return {
        isEditing: !prevState.isEditing,
        name: beer.name,
        description: beer.description
      };
    });
  }

  onSubmitEdits(event, beer) {
    event.preventDefault();
    const { name, description } = this.state;
    const id = beer.id;
    this.props.editBeerDetails(name, description, id);
    this.setState({ isEditing: false });
  }

  onBeerSelect(i, newCustomizations) {
    const customizations = this.props.customizations.length !== 0 ? this.props.customizations : newCustomizations;
    this.props.history.push({ pathname: "/admin/branding", search: `?id=${customizations[i].id}` });
    const colour = customizations[i].colour;
    const minRGB = [55, 8, 10];
    const step = [2, 2.25, 1.45];
    const rgb = minRGB.map((c, i) => {
      return Math.round(c + step[i] * colour);
    }).join(",");
    this.setState({ index: i, rgb });
  }

  onAddToBasket() {
    const { quantity, index } = this.state;
    if (quantity < 1) return;
    const { customizations, addToBasket } = this.props;
    const customizationId = customizations[index].id;
    addToBasket(quantity, customizationId);
  }

  render() {
    const { name, description, isEditing, rgb, index, imageType, customImage, quantity } = this.state;
    const { customizations, editError, isLoadingEdits, isLoadingCustomizations, isLoadingBasket } = this.props;
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
              { isEditing
                ? <form onSubmit={(event) => this.onSubmitEdits(event, beer)}>
                  <MaterialInput type="text" id="beer-name" labelText="Name" value={name}
                    onChange={(event) => this.setState({ name: event.target.value })} />
                  <MaterialTextarea id="beer-description" labelText={"Description (" + description.length + "/800)"}
                    value={description} onChange={(event) => this.setState({ description: event.target.value })} />
                  <div className="form-base">
                    <div>
                      <button type="submit">Done</button>
                      <button type="reset" onClick={() => this.onEditClick(beer)}>Cancel</button>
                    </div>
                  </div>
                </form>
                : <React.Fragment>
                  <div className="title-bar">
                    { isLoadingEdits ? <span className="loading spin material-icons">toys</span>
                      : <React.Fragment>
                        {editError
                          ? <p className="error"><span className="material-icons">error</span>{editError}</p>
                          : <h2 className="beer-name">{beer.name}</h2> }
                        <button onClick={() => this.onEditClick(beer)}>Edit</button>
                      </React.Fragment>
                    }
                  </div>
                  { !isLoadingEdits ? <p>{beer.description}</p> : null }
                </React.Fragment>
              }
              <ul className="beer-facts">
                <li>Volume: {beer.volume}</li>
                <li>Colour: <div className="beer-colour" style={{ backgroundColor: "rgb(" + rgb + ")" }} /></li>
                <li>Hoppiness: {beer.hoppiness}</li> <li>Malt Flavour: {beer.maltFlavour}</li>
              </ul>
              <hr />
              <h3>Make a Logo</h3>
              <div>
                <div className="beer-flex">
                  <div className="beer-image-options">
                    <MaterialSelect options={imageOptions} selected={imageType}
                      onSelect={(i) => this.setState({ imageType: i })} />
                  </div>
                  { imageType === 0
                    ? <div className="custom-image">
                      <input type="file" accept="image/*" onChange={(event) => this.onCustomImageChange(event)} />
                      { customImage ? <img src={customImage} alt={beer.name} /> : null }
                    </div>
                    : <BeerImage type={imageTypes[imageType - 1]} text={beer.name} />
                  }
                </div>
              </div>
              <hr />
              <h3>Order your Beer</h3>
              <div className="product-base">
                <label htmlFor="quantity">Quantity: </label>
                <input id="quantity" type="number" className="quantity-input" value={quantity}
                  onChange={(event) => this.setState({ quantity: event.target.value })} />
                <span>litres</span>
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
  isLoadingEdits: PropTypes.bool.isRequired,
  editError: PropTypes.string.isRequired,
  getCustomizations: PropTypes.func.isRequired,
  addToBasket: PropTypes.func.isRequired,
  editBeerDetails: PropTypes.func.isRequired,
  location: PropTypes.object,
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {
    customizations: state.branding.customizations,
    isLoadingCustomizations: state.branding.isLoading,
    isLoadingEdits: state.branding.isLoadingEdits,
    editError: state.branding.editError,
    isLoadingBasket: state.shop.isLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomizations: () => dispatch(getCustomizations()),
    addToBasket: (quantity, customizationId) => dispatch(addProductToBasket(1, quantity, customizationId)),
    editBeerDetails: (name, description, id) => dispatch(editCustomizationDetails(name, description, id))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Branding));
