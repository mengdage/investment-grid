import React, { Component } from 'react';

import InvestmentGrid from './InvestmentGrid'
import FaBeer from 'react-icons/lib/fa/beer';
import {
  platforms,
  fixtureData
} from './data'

import './App.css';



class App extends Component {

  render() {
    return (
      <div className="App">
        <h1>Brand Investment Grid <FaBeer /></h1>
        <InvestmentGrid
          platforms={platforms}
          investmentData={fixtureData}
        />
      </div>
    );
  }


}

export default App;
