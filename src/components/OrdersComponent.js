'use strict';

import React from 'react';
import firebase from '../database';
import OrderComponent from './OrderComponent';

require('styles//Orders.css');

class OrdersComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }
  
  componentWillMount() {
    this.orderRef = firebase.database().ref('order');
    this.listenForOrders();
  }

  componentWillUnmount() {
    this.orderRef.off();
  }

  listenForOrders() {
    this.orderRef.on('value', (snap) => {
      let orders = [];
      snap.forEach((_order) => {
        let order = _order.val();
        order.key = _order.key;
        orders.push(order);
      });
      this.setState({
        orders: orders
      });
    })
  }

  render() {
    return (
      <div className="orders-component">
        { this.state.orders
          .filter((order) => order.user === firebase.auth().currentUser.email)
          .filter((order) => order.status === 'ordered')
          .map((order) => {
          return(
            <OrderComponent order={ order } key={ order.key }/>
          );
        }) }
      </div>
    );
  }
}

OrdersComponent.displayName = 'OrdersComponent';

export default OrdersComponent;
