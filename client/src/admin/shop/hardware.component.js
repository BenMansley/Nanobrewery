import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProductsByCategory } from './shop.actions';

class Hardware extends Component {

  componentDidMount() {
    this.props.getProducts();
  }

  render() {
    let products = [];
    products = this.props.products.map((product) => {
      return (
        <div className="card product" key={product.id}>
          <h2 className="product-name">{product.name}</h2>
          <p>{product.description}</p>
          <div className="product-base">
            <span className="product-price">£{product.price}</span>
            <button className="product-add">Add to Basket</button>
          </div>
        </div>
      )
    });

    return (
      <div className="page-content">
        <h1 className="page-title">Hardware</h1>
        <div>
          {this.props.isLoading ? <span className="loading material-icons">toys</span> : null }
          {products}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    products: state.shop.productsVisible,
    isLoading: state.shop.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getProducts: () => dispatch(getProductsByCategory('hardware'))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Hardware);