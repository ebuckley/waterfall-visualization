import React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, NavLink, Link } from "react-router-dom";
import auth from './services/authService';
import UserDetails from './components/UserDetails';
import Loading from './components/Loading';
import DatasetReport from './components/DatasetReport';
import Error from './components/Error';
import { getProfile } from './services/profileService';

// A component that handles redirect for auth0 authentication flow
class Callback extends Component {
  state = { loginSuccess: false, error: null };
  componentDidMount() {
    auth.handleAuthentication()
      .then(() => {
        this.setState({ loginSuccess: true })
      }, err => {
        this.setState({ error: err })
        console.error('failed to handle authentication', err)
      })
  }

  render() {
    const { loginSuccess, error } = this.state;
    if (error) {
      return <div>Error with login {error.errorDescription}</div>
    }
    if (loginSuccess) {
      return <Redirect to="/" />
    }
    return <div>Loading...</div>
  }
}

function LandingPage(profile) {
  if (!profile) {
    return <div>loading..</div>
  }
  const datasetOptions = profile.datasets.map(name => (<li key={name}><Link to={'dataset/' + name}>{name}</Link></li>))
  return <div>
    <h2>Available Datasets</h2>
    <ul>
      {datasetOptions}
    </ul>
  </div>
}

function Profile(user, profile) {
  return <div>
    <h2>Auth0 Details</h2>
    <pre>{JSON.stringify(user, null, '   ')}</pre>
    <h2>User Profile</h2>
    <pre>{JSON.stringify(profile, null, '   ')}</pre>
  </div>
}

class App extends Component {
  state = { profile: null, user: null, loading: true, error: null }
  constructor() {
    super(...arguments)
    auth.renewTokens()
      .then(success => {
      }, err => {
        if (err === "Not logged in") {
          // we can handle this class of error in the loginEvent
          return
        }
        console.error('Unrecoverable renew token error', err)
        this.setState({ error: err })
      })
    // TODO add indicator of loading state
    // .finally(() => this.setState({ loading: false }));

    auth.on('loginEvent', (loginEvent) => {
      console.info('Updating login state', loginEvent)
      if (loginEvent.loggedIn) {
        getProfile()
          .then(result => {
            this.setState({ profile: result, loading: false })

          }, err => {
            this.setState({ error: err })
          })
        this.setState({
          user: loginEvent
        })
      } else {
        this.setState({
          user: null
        })
      }
    });
  }
  render() {
    if (this.state.error) {
      return (<Error error={this.state.error} />)
    }
    if (this.state.loading) {
      return (<Loading />);
    }
    return (<Router>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <UserDetails user={this.state.user} />
      </nav>
      <Route path="/" exact render={() => LandingPage(this.state.profile)} />
      <Route path="/dataset/:name" component={DatasetReport} />
      <Route path="/profile" render={() => Profile(this.state.user, this.state.profile)} />
      <Route path="/callback" component={Callback} />
    </Router >
    );
  }
}

export default App;
