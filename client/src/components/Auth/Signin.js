import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { SIGNIN_USER } from "../../queries";
import { withRouter } from "react-router-dom";
import Error from "../Error";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  validateForm(e) {
    const { username, password } = this.state;
    // Validate required inputs
    return !username || !password;
  }

  render() {
    const { username, password } = this.state;
    return (
      <div className="content">
        <Mutation mutation={SIGNIN_USER}>
          {(signinUser, { data, loading, error }) => (
            <form
              className="form"
              onSubmit={async e => {
                e.preventDefault();
                // Send data to server
                const { data } = await signinUser({
                  variables: {
                    username,
                    password
                  }
                });
                // Save token to Local Storage
                localStorage.setItem("token", data.signinUser.token);
                // Reset current User
                await this.props.refetch();
                // Clear state
                this.setState({ username: "", password: "" });
                // Redirect to Home Page
                this.props.history.push("/");
              }}
            >
              <h2>Sign In</h2>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={this.handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
              />
              <button type="submit" disabled={loading || this.validateForm()}>
                Submit
              </button>
              {error ? <Error message={error.message.split(":")[1]} /> : ""}
            </form>
          )}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signin);
