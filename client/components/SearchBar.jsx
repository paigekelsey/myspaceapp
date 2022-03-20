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
                    src="https://res.cloudinary.com/teepublic/image/private/s--OHa3r8SX--/c_crop,x_10,y_10/c_fit,h_645/c_crop,g_north_west,h_827,w_1127,x_-297,y_-91/l_misc:transparent_1260/fl_layer_apply,g_north_west,x_-363,y_-303/c_mfit,g_north_east,u_misc:tapestry-l-s-gradient/e_displace,fl_layer_apply,x_0,y_34/l_upload:v1507037315:production:blanks:uue6kkaylik55suzvwsb/fl_layer_apply,g_north_west,x_0,y_0/b_rgb:000000/c_limit,f_jpg,h_630,q_90,w_630/v1569179511/production/designs/6055223_0.jpg"
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
