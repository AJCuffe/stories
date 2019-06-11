import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { SIGNUP_USER } from "../../queries";
import { Mutation } from "react-apollo";
import Error from "../Error";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      password2: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  validateForm() {
    // Check required inputs
    const { username, email, password, password2 } = this.state;
    return (
      !username || !email || !password || !password2 || password2 !== password
    );
  }

  render() {
    const { username, email, password, password2 } = this.state;
    return (
      <div className="content">
        <h2>Register New User</h2>
        <Mutation mutation={SIGNUP_USER}>
          {(signupUser, { data, loading, error }) => (
            <form
              className="form"
              onSubmit={async e => {
                try {
                  e.preventDefault();
                  // Get token from GraphQL server
                  const { data } = await signupUser({
                    variables: { username, email, password }
                  });
                  // Save token to local storage
                  localStorage.setItem("token", data.signupUser.token);
                  // Reload current user data
                  await this.props.refetch();
                  this.props.history.push("/");
                  // Clear current state
                  this.setState({
                    email: "",
                    password: "",
                    password2: "",
                    username: ""
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={this.handleChange}
                value={username}
              />
              <input
                type="text"
                placeholder="Email"
                name="email"
                onChange={this.handleChange}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
                value={password}
              />
              <input
                type="password"
                placeholder="Repeat password"
                name="password2"
                onChange={this.handleChange}
                value={password2}
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

export default withRouter(Signup);
