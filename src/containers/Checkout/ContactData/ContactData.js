import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../../axios-order.js";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/Layout/withErrorHandler/withErrorHandler";
import classes from "./ContactData.module.css";
import * as actionCreators from "../../../store/actions/index";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your name"
        },
        value: "",
        valueType: "name",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street"
        },
        value: "",
        valueType: "street",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Zip code"
        },
        value: "",
        valueType: "zip code",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country"
        },
        value: "",
        valueType: "country",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email"
        },
        value: "",
        valueType: "email",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliverMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fatest" },
            { value: "cheapest", displayValue: "Cheapest" }
          ]
        },
        value: "fastest",
        valueType: "delivery method",
        validation: {},
        valid: true
      }
    },
    formIsValid: false
  };

  orderHandler = event => {
    event.preventDefault();

    const formData = {};
    for (let key in this.state.orderForm) {
      formData[key] = this.state.orderForm[key].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice, // make sure to calculate on the backend to ensure that user isn't manipulating it
      orderData: formData
    };
    this.props.onOrderBurger(order);
  };

  inputChangeHandler = (event, name) => {
    const updatedOrderForm = {
      ...this.state.orderForm,
      [name]: {
        ...this.state.orderForm[name],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.orderForm[name].validation
        ),
        touched: true
      }
    };
    let formIsValid = true;
    for (let key in updatedOrderForm) {
      formIsValid = updatedOrderForm[key].valid && formIsValid;
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid });
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return isValid;
    }
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    console.log(isValid);
    return isValid;
  }

  render() {
    const formElementsArray = Object.keys(this.state.orderForm).map(key => ({
      ...this.state.orderForm[key],
      name: key
    }));

    let form = (
      <form onSubmit={this.orderHandler}>
        <h4>Enter your contact data</h4>
        <p>{!this.state.formIsValid && "disabled"}</p>
        {formElementsArray.map(el => (
          <Input
            key={el.name}
            elementType={el.elementType}
            elementConfig={el.elementConfig}
            value={el.value}
            valueType={el.valueType}
            changed={e => this.inputChangeHandler(e, el.name)}
            invalid={!el.valid}
            shouldValidate={!!el.validation}
            touched={el.touched}
          />
        ))}

        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    return <div className={classes.ContactData}>{form}</div>;
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilderReducer.ingredients,
    totalPrice: state.burgerBuilderReducer.totalPrice,
    loading: state.orderReducer.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: order => dispatch(actionCreators.purchaseBurger(order))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
