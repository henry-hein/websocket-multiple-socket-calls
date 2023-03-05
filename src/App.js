import { useEffect, useState } from 'react';
const App = () => {
  const endpoint = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';
  const ws = new WebSocket(endpoint);
  
  const [baseCurrencies, setBaseCurrencies] = useState([]);
  const [inputValue, setInputValue] = useState(1);
  const [chosenCurrency, setChosenCurrency] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  
  useEffect(() => {
    ws.onopen = (event) => {
      console.log('Socket is open');
      if (chosenCurrency !== '') {
        console.log('Getting Exchange Rates');
        ws.send(JSON.stringify({exchange_rates: 1, base_currency: chosenCurrency}))   
      } else {
        console.log('Getting Pay Out Currencies')
        ws.send(JSON.stringify({payout_currencies : 1}));
      }
    }
    
    ws.onmessage = function (event) {
      
      console.log('Socket is receiving messages');
      const json = JSON.parse(event.data);
      console.log(json);
      if(json.msg_type === 'payout_currencies') {
        setBaseCurrencies(json.payout_currencies);
      } else if(json.msg_type === 'exchange_rates'){
        setExchangeRates(json.exchange_rates.rates);
      }
    }
  },[chosenCurrency, exchangeRates])
  
  const rateEntriesArr = Object.entries(exchangeRates);
  // rateEntriesArr.forEach(entry => {
  //     entry[2] = entry[1] * inputValue;
  // })

  const dropdownChange = (e) => {
    setChosenCurrency(e.target.value);
  }

  const onChange = (e) => {     
    setInputValue(e.target.value);
  };

  
  return (
    <div className="App">
      <div>
        <div>
          <label htmlFor="baseCurrency">Choose Base Currency:
            <select name="baseCurrency" id="baseCurrency" onChange={dropdownChange}>
            {baseCurrencies && baseCurrencies.map((currency, index) => (
              <option key={index} value={currency}>{currency}</option>
            ))}
            </select>
          </label>
        </div>
        <div>
          <label> Input Amount({chosenCurrency}) :   
            <input 
              type="number" 
              name=""
              placeholder="Please enter a value" 
              value={inputValue} 
              onChange={onChange} 
            />
          </label>
        </div>
      </div>

      <table className="table table-light">
        <thead>
          <tr className="table-light">
            <th scope="col">Currency</th>
            <th scope="col">Rates</th>
            <th scope="col">Exchange {inputValue} {chosenCurrency} to</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(exchangeRates).map((key) => (
            <tr className="table-light">
              <td className="table-light">{key}</td>
              <td className="table-light">{exchangeRates[key]}</td>
              <td className="table-light">
                {(chosenCurrency === 'GBP' ||
                  chosenCurrency === 'USD' ||
                  chosenCurrency === 'EUR' ||
                  chosenCurrency === 'AUD')  ?
                ((exchangeRates[key]*inputValue).toFixed(2)) : (exchangeRates[key]*inputValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
  );
}

export default App;