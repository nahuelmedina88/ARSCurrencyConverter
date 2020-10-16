import React, { Fragment, useState, useEffect } from 'react';
import Header from "./components/Header";

import './App.css';
import Form from './components/Form';
import "bootstrap/dist/css/bootstrap.min.css";
import ResultBox from './components/ResultBox';


function App() {
  const [countryCode, updateCountryCode] = useState([]);
  const urlListAllCountries = "https://free.currconv.com/api/v7/currencies?apiKey=e7e6d77d88f7a3697a77";

  const [amountArgentinianCurrency, updateAmountArgentinianCurrency] = useState(0);
  const [amountForeignCurrency, updateAmountForeignCurrency] = useState(0);
  const [foreignCurrency, updateForeignCurrency] = useState(0);
  const [loading, updateLoading] = useState(false);

  const compare = (a, b) => {
    if (a.currencyName < b.currencyName) {
      return -1;
    }
    if (a.currencyName > b.currencyName) {
      return 1;
    }
    return 0;
  }

  const getAmountArgentinianCurrency = (value) => {
    updateAmountArgentinianCurrency(value);
  }
  const getForeignCurrency = (value) => {
    updateForeignCurrency(value);
  }
  const getAmountForeignCurrency = value => {
    updateAmountForeignCurrency(value);
  }
  const getLoadingState = value => {
    updateLoading(value);
  }

  useEffect(() => {
    const callAPI = async () => {
      const api = await fetch(urlListAllCountries);
      const response = await api.json();
      const countries = Object.values(response.results);
      const countriesSorted = countries.sort(compare);
      //ingresado para react-select
      const tempOptions = countriesSorted.map(option => ({
        id: option.id,
        value: option.id,
        label: option.currencyName
      }));
      //end
      updateCountryCode(tempOptions);
    }
    callAPI();
  }, [])
  return (
    <Fragment>
      <div className="containerCustom">
        <Header />
        <Form
          countryCode={countryCode}
          getAmountArgentinianCurrency={getAmountArgentinianCurrency}
          getAmountForeignCurrency={getAmountForeignCurrency}
          getForeignCurrency={getForeignCurrency}
          getLoadingState={getLoadingState}
        />
        <ResultBox
          amountArgentinianCurrency={amountArgentinianCurrency}
          amountForeignCurrency={amountForeignCurrency}
          foreignCurrency={foreignCurrency}
          loading={loading}
        />

      </div>
    </Fragment>
  );
}

export default App;
