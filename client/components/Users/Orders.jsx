import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";

// Style Import
import "../../../public/assets/user.css";

// Component Imports
import OrderItem from "./OrderItem.jsx";
import { getSingleUser } from "../../store/actionCreators/singleUser";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
    };
  }

  async componentDidMount() {
    await this.props.getSingleUser(this.props.user.id);
    const user = await this.props.singleUser;
    await this.setState({ ...this.state, loading: false, user: user });
  }

  render() {
    const { user, loading } = this.state;
    console.log(user);
    if (loading) return <div>Loading...</div>;
    return (
      <React.Fragment>
        <div id="order-title-container" className="order-item">
          <h3 id="order-title">Order History</h3>
        </div>
        <div id="orders-container">
          {user.orders.length
            ? user.orders.map((order) => (
                <OrderItem {...order} key={order.id} />
              ))
            : "No Orders"}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.signedIn.user,
    singleUser: state.singleUser,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSingleUser: (id) => dispatch(getSingleUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
