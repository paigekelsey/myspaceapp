import { Link } from "react-router-dom";
import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import AllProducts from "./AllProducts.jsx";

const SearchBar = (products) => {
    const [search, setSearch] = useState("");

    function searchFunc(products) {
        return products.filter(
            (currPro) => currPro.name.toLowerCase().indexOf(search) > -1,
        );
    }
    return (
        <React.Fragment>
            <div id="store-banner">
                <img
                    className="store-banner-img"
                    src="/images/artwork/banner.jpeg"
                    alt=""
                />
            </div>
            <div id="search-bar">
                <div id="search-function">
                    <input
                        type="text"
                        placeholder="Search for a painting..."
                        value={search}
                        onChange={(evt) => setSearch(evt.target.value)}
                    />
                </div>

                <div>
                    <AllProducts
                        filterProducts={searchFunc(products.products)}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};
const mapStateToProps = (state) => {
    return {
        products: state.allProducts,
    };
};

export default connect(mapStateToProps)(SearchBar);
