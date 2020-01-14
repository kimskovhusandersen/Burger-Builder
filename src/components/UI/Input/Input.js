import React from "react";

import classes from "./Input.module.css";

const input = props => {
  let inputElement = null;
  let validationError = null;
  const inputClasses = [classes.InputElement];

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
    validationError = (
      <p className={classes.ValidationError}>
        Please enter a valid {props.valueType}
      </p>
    );
  }

  if (props.elementType === "input") {
    inputElement = (
      <input
        {...props.elementConfig}
        className={inputClasses.join(" ")}
        value={props.value}
        onChange={props.changed}
      />
    );
  } else if (props.elementType === "textarea") {
    inputElement = (
      <textarea
        {...props.elementConfig}
        className={inputClasses.join(" ")}
        value={props.value}
        onChange={props.changed}
      />
    );
  } else if (props.elementType === "select") {
    inputElement = (
      <select
        className={inputClasses.join(" ")}
        value={props.value}
        onChange={props.changed}
      >
        {props.elementConfig.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.displayValue}
          </option>
        ))}
      </select>
    );
  }
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {validationError}
      {inputElement}
    </div>
  );
};

export default input;
