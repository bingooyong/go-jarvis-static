import React, { Component } from 'react'
import { BrowserRouter as Router,  Route, Switch } from 'react-router-dom'
import asyncComponent from '../components/AsyncComponent/AsyncComponent'

const AsyncLogin = asyncComponent(() => import('../components/Login/Login'));
const AsyncLayout = asyncComponent(() => import('../components/Layout/Layout'));

class App extends Component {
  state = {
    showLayout: true
  }

  componentWillMount() {
    const pathName = window.location.pathname
    if (pathName === '/web/login') this.setState({ showLayout: false })
  }

  render() {
    const { showLayout } = this.state

    return (
      <Router basename="/web">
        <Switch>
          <Route path="/login" component={AsyncLogin} />
          { showLayout && <AsyncLayout /> }
        </Switch>
      </Router>
    );
  }
}

export default App;
