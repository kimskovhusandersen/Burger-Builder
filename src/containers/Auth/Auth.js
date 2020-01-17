import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import * as actions from "../../store/actions";
import { connect } from "react-redux";

import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Spinner from "../../components/UI/Spinner/Spinner";
import { checkValidity } from "../../shared/utility";
import classes from "./Auth.module.css";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your e-mail"
        },
        value: "",
        valueType: "email",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Enter new password"
        },
        value: "",
        valueType: "password",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isSignUp: true
  };

  componentDidMount() {
    if (!this.props.isBuildingBurger && this.props.authRedirectPath !== "/") {
      this.props.onSetAuthRedirectPath();
    }
  }

  inputChangeHandler = (event, name) => {
    const updatedControls = {
      ...this.state.controls,
      [name]: {
        ...this.state.controls[name],
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[name].validation
        ),
        touched: true
      }
    };
    let formIsValid = true;
    for (let key in updatedControls) {
      formIsValid = updatedControls[key].valid && formIsValid;
    }

    this.setState({ controls: updatedControls, formIsValid });
  };

  submitHandler = event => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
  };

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignUp: !prevState.isSignUp };
    });
  };

  render() {
    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    const formElementsArray = Object.keys(this.state.controls).map(key => ({
      ...this.state.controls[key],
      name: key
    }));

    let form = formElementsArray.map(el => (
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
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
          Switch to {this.state.isSignUp ? "Login" : "Register"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.authReducer.loading,
    error: state.authReducer.error,
    isAuthenticated: state.authReducer.token !== null,
    isBuildingBurger: state.burgerBuilderReducer.building,
    authRedirectPath: state.authReducer.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
