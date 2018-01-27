import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { } from '../shop.actions';

const Basket = ({user, items}) => {
  
  const basketItems = items.map((item, i) => {
    return (
      <div key={i}>
        <p>{item.name}</p>
        <span>{item.quantity}</span> | <span>{item.price}</span>
      </div>
    );
  })

  return (
    <div className="page-content">
      <h1 className="page-title">Your Basket</h1>
      <div>
        {basketItems}
      </div>
    </div>
  )
}

Basket.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    companyName: PropTypes.string
  }).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      quantity: PropTypes.number,
      price: PropTypes.number
    })
  ).isRequired
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    items: state.shop.basket
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Basket);