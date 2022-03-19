import React, { Component } from "react";

// Redux Imports
import { connect } from "react-redux";
import { getSingleUser } from "../../store/actionCreators/singleUser";
import {
    updateOrder_thunk,
    deleteOrder_thunk,
} from "../../store/actionCreators/orders";

// Component Imports
import AreYouSure from "../AreYouSure.jsx";
import AdminOrderItem from "./AdminOrderItem.jsx";

class AdminOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            loading: true,
            user: null,
            orders: [],
            dialogueOpen: [],
            deleteDialog: false,
            orderDeleteStaged: NaN,
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openDelete = this.openDelete.bind(this);
        this.closeDelete = this.closeDelete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    async componentDidMount() {
        const { id } = this.state;

        await this.props.getUser(id);
        const { user } = this.props;

        this.setState({
            ...this.state,
            user,
            loading: false,
            orders: user.orders.sort((a, b) => a.id - b.id),
        });
    }

    handleOpen(id) {}

    handleClose() {}

    handleSubmit(id, products, status, total) {}

    openDelete(id) {
        this.setState({
            ...this.state,
            deleteDialog: true,
            orderDeleteStaged: id,
        });
    }

    closeDelete() {
        this.setState({
            ...this.state,
            deleteDialog: false,
            orderDeleteStaged: NaN,
        });
    }

    async handleDelete(id) {
        const { orderDeleteStaged } = this.state;
        await this.props.deleteOrder(orderDeleteStaged);
        const { user } = this.props;

        this.setState(
            {
                ...this.state,
                user,
                orders: user.orders.sort((a, b) => a.id - b.id),
            },
            () => {
                this.closeDelete();
            },
        );
    }

    render() {
        const { user, loading, deleteDialog } = this.state;
        if (loading) {
            return "Loading...";
        }

        return (
            <React.Fragment>
                <div id="order-title-container" className="order-item">
                    <h3 id="order-title">Order History</h3>
                </div>
                <div id="orders-container">
                    {user.orders.length
                        ? user.orders.map((order) => (
                              <AdminOrderItem
                                  {...order}
                                  handleOpen={this.handleOpen}
                                  openDelete={this.openDelete}
                                  key={order.id}
                              />
                          ))
                        : "No Orders"}
                </div>
                <AreYouSure
                    message="Are you sure you want to delete this order?"
                    open={deleteDialog}
                    close={this.closeDelete}
                    userFn={this.handleDelete}
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.singleUser,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getUser: (id) => dispatch(getSingleUser(id)),
        updateOrder: (order) => dispatch(updateOrder_thunk(user)),
        deleteOrder: (id) => dispatch(deleteOrder_thunk(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminOrders);
