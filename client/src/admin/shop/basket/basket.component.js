import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getBasketItems, updateQuantity } from "../shop.actions";

class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantities: {}
    };
  }

  componentDidMount() {
    this.props.getBasketItems();
  }

  updateQuantity(quantity, id) {
    let quantities = this.state.quantities;
    quantities[id] = Math.max(quantity, 0);
    this.setState({ quantities });
  }

  render() {
    const { items, isLoading, updateQuantity } = this.props;
    const quantities = this.state.quantities;

    const totalPrice = items.reduce((prev, cur) => { return prev + cur.price * cur.quantity; }, 0);
    const basketItems = items.map((item, i) => {
      const quantity = quantities[item.id] !== undefined ? quantities[item.id] : item.quantity;
      return (
        <div key={item.id} className="card product">
          <h2 className="product-name">{item.name}</h2>
          <p>{item.description}</p>
          <div className="product-base">
            <label htmlFor="quantity">Quantity: </label>
            <input className="quantity-input" type="number" id="quantity" value={quantity}
              onChange={(event) => this.updateQuantity(event.target.value, item.id)}
              onBlur={(event) => updateQuantity(event.target.value, item.id)} />
            <label>Total Price:</label>
            <span className="price">£{item.price * quantity}</span>
          </div>
        </div>
      );
    });

    return (
      <div className="page-content">
        <h1 className="page-title">Your Basket</h1>
        <div className="basket">
          <div>{basketItems}</div>
          <div className="basket-actions-container">
            { isLoading ? <span className="loading spin material-icons">toys</span>
              : <div className="card basket-actions">
                <p>Basket Total: <span className="price">£{totalPrice}</span></p>
                <button>Checkout</button>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

Basket.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      quantity: PropTypes.number,
      price: PropTypes.number
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  getBasketItems: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    items: state.shop.basketItems,
    isLoading: state.shop.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getBasketItems: () => dispatch(getBasketItems()),
    updateQuantity: (quantity, productId) => dispatch(updateQuantity(quantity, productId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Basket);
