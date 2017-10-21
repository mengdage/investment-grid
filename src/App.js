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
          levels={50} hexColor="00ff00"

        />
        <ColorContainer levels={50} hexColor="00ff00"/>
      </div>
    );
  }


}

export default App;
