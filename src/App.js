import React, { Component } from 'react';
import CovidAppContract from '../build/contracts/CovidApp.json';
import getWeb3 from './utils/getWeb3';
import {connect} from "react-redux";
import { setGlobalData } from './actions/global_vars';
import { logoutProxy } from './actions/auth';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/generic.css'
import './css/antd.css'
import './css/style.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null
    }
  }

  componentWillMount() {


    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      results.web3.eth.defaultAccount = results.web3.eth.accounts[0];
      this.props.setGlobalData({web3: results.web3});
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const CovidRecord = contract(CovidAppContract);
    CovidRecord.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts((error, accounts) => {
      CovidRecord.deployed().then((instance) => {
        this.props.setGlobalData({CovidRecord: instance});
      }).catch((err) => {
        console.log(err);
      });
    });
    let account = this.state.web3.eth.accounts[0];
    let that = this;
    let checkAccountInterval = setInterval(function() {
      if (that.state.web3.eth.accounts[0] !== account) {
        account = that.state.web3.eth.accounts[0];
        logoutProxy();
        window.location.reload();
      }
    }, 500);
  }

  render() {
    return (
        <div>
            {this.props.children}
        </div>
    );
  }
}

const actionCreators = {
  setGlobalData
};

export default connect(null, actionCreators)(App);