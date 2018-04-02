import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProductsByCategory, addProductToBasket } from "./shop.actions";

class Hardware extends Component {
  componentDidMount() {
    this.props.getProducts();
  }

  render() {
    const { products, isLoading, userId, addToBasket } = this.props;

    let productList = [];
    productList = products.map((product) => {
      return (
        <div className="card product" key={product.id}>
          <h2 className="product-name">{product.name}</h2>
          <p>{product.description}</p>
          <div className="product-base">
            <span className="price">£{product.price}</span>
            { product.quantity === null
              ? <button className="product-add" onClick={() => addToBasket(product.id, userId)}>Add to Basket</button>
              : <Link className="product-add button" to="/admin/basket">In Basket</Link>
            }
          </div>
        </div>
      );
    });

    return (
      <div className="page-content">
        <h1 className="page-title">Hardware</h1>
        <div>
          {isLoading ? <span className="loading material-icons">toys</span> : null }
          {productList}
        </div>
      </div>
    );
  }
}

Hardware.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.number,
      category: PropTypes.string
    })
  ),
  isLoading: PropTypes.bool.isRequired,
  userId: PropTypes.number,
  getProducts: PropTypes.func.isRequired,
  addToBasket: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    products: state.shop.productsVisible,
    isLoading: state.shop.isLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProducts: () => dispatch(getProductsByCategory("hardware")),
    addToBasket: (productId) => dispatch(addProductToBasket(productId, 1))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Hardware);
