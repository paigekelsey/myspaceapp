import React, { Component } from "react";
import { useState } from "react";

import { useSelector } from "react-redux";

import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

const ProductChecbox = ({ categories, checkAction }) => {
    const classes = useStyles();
    const [state, setState] = useState(categories);

    const handleChange = async (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        checkAction(event);
    };

    let mappedState = [];
    for (const [name, checked] of Object.entries(state)) {
        mappedState.push({ name, checked });
    }

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Categories</FormLabel>
                <FormGroup row>
                    {mappedState.map((cat, idx) => {
                        return (
                            <FormControlLabel
                                key={idx}
                                control={
                                    <Checkbox
                                        checked={cat.checked}
                                        onChange={handleChange}
                                        name={cat.name}
                                    />
                                }
                                label={cat.name}
                            />
                        );
                    })}
                </FormGroup>
            </FormControl>
        </div>
    );
};

export default ProductChecbox;
