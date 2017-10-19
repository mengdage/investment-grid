import React, { Component } from 'react';

import InvestmentGrid from './InvestmentGrid'
import FaBeer from 'react-icons/lib/fa/beer';
import {
  platforms,
  fixtureDataShort,
  fixtureDataLong
} from './data'
import ColorContainer from './ColorContainer'
import './App.css';



class App extends Component {

  render() {
    return (
      <div className="App">
        <h1>Brand Investment Grid <FaBeer /></h1>
        <InvestmentGrid
          platforms={platforms}
          investmentData={fixtureDataShort}
        />
        <ColorContainer levels={20} hexColor="006F80"/>
      </div>
    );
  }


}

export default App;
