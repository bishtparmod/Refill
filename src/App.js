import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Root from './Root'
import './App.css'
import { Provider } from 'react-redux'
import { Store } from './redux'

export default class App extends PureComponent {
  static propTypes = {

  }

  render = () => {
    return (
      <Provider store={Store}>
        <Root />
      </Provider>
    )
  }
}
