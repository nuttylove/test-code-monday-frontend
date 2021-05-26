import axios from 'axios';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

const App = () => {
  const [global, setGlobal] = useState({});
  const [countries, setCountries] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('https://api.covid19api.com/summary');
      setGlobal(data.Global);
      const sortCountry = data.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
      setCountries(sortCountry);
      setCountriesList(sortCountry);
    })();
    return () => {}
  }, []);

  const searchChange = useCallback(() => {
    if (!searchRef.current.value) setCountries(countriesList);
  }, [searchRef.current]);

  const formatNumber = number => new Intl.NumberFormat().format(number);

  const reported = report => report === 0 ? 'unreported' : formatNumber(report);

  const sorted = name => setCountries(countries.sort((a, b) => b[name] - a[name]));

  const search = () => {
    if (searchRef.current.value) {
      const filterList = countries.filter(country => country?.Slug.indexOf(String(searchRef.current.value).toLowerCase()) !== -1).sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
      setCountries(filterList);
    }
  };

  return (
    <div className="App">
      <div className="max-w-md mx-auto items-center bg-green-300 rounded-xl shadow-md overflow-hidden min-w-max p-4 m-4 grid grid-rows-2 gap-y-2">
        <label className='font-bold text-2xl'>{moment(global?.Date).format('DD MMM YYYY')}</label>
        <div className='grid grid-cols-3 gap-3 divide-x divide-green-500'>
          <div className='text-center'>
            <div className="text-gray-600 font-bold text-base mb-2">New Confirmed</div>
            <p className="text-red-600 text-base">{formatNumber(global?.NewConfirmed)}</p>
          </div>
          <div className='text-center'>
            <div className="text-gray-600 font-bold text-base mb-2">New Deaths</div>
            <p className="text-red-600 text-base">{formatNumber(global?.NewDeaths)}</p>
          </div>
          <div className='text-center'>
            <div className="text-gray-600 font-bold text-base mb-2">New Recovered</div>
            <p className="text-red-600 text-base">{formatNumber(global?.NewRecovered)}</p>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-3 divide-x divide-green-500'>
          <div className='text-center'>
            <div className="text-gray-600 font-bold text-base mb-2">Total Confirmed</div>
            <p className="text-blue-600 text-base">{formatNumber(global?.TotalConfirmed)}</p>
          </div>
          <div className='text-center'>
            <div className="text-gray-600 font-bold text-base mb-2">Total Deaths</div>
            <p className="text-blue-600 text-base">{formatNumber(global?.TotalDeaths)}</p>
          </div>
          <div className='text-center'>
            <div className="text-gray-600 font-bold text-base mb-2">Total Recovered</div>
            <p className="text-blue-600 text-base">{formatNumber(global?.TotalRecovered)}</p>
          </div>
        </div>
      </div>
      <div className='items-center space-x-4'>
        <label className='text-lg'>Country name</label>
        <input type='search' ref={searchRef} onChange={searchChange} className="border-2 border-green-700 focus:border-green-700 rounded h-10" />
        <button onClick={search} className="bg-green-600 rounded text-white h-10 w-1/12 focus:bg-green-700">
          Filter
        </button>
      </div>
      <div className='p-8'>
      <table className="table-auto text-center shadow-lg" width='100%'>
        <thead>
          <tr>
            <th className='text-justify'>Country</th>
            <th>New Confirmed</th>
            <th>New Deaths</th>
            <th>New Recovered</th>
            <th><button onClick={() => sorted('TotalConfirmed')}>Total Confirmed</button></th>
            <th><button onClick={() => sorted('TotalDeaths')}>Total Deaths</button></th>
            <th><button onClick={() => sorted('TotalRecovered')}>Total Recovered</button></th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country, idx) => (
            <tr key={`country-${idx}`}>
              <td className='border border-gray-500 text-gray-700 text-justify'>{country?.Country}</td>
              <td className='border border-gray-500 bg-red-200 text-red-600'>{reported(country?.NewConfirmed)}</td>
              <td className='border border-gray-500 bg-red-200 text-red-600'>{reported(country?.NewDeaths)}</td>
              <td className='border border-gray-500 bg-red-200 text-red-600'>{reported(country?.NewRecovered)}</td>
              <td className='border border-gray-500 bg-green-200 text-blue-600'>{reported(country?.TotalConfirmed)}</td>
              <td className='border border-gray-500 bg-green-200 text-blue-600'>{reported(country?.TotalDeaths)}</td>
              <td className='border border-gray-500 bg-green-200 text-blue-600'>{reported(country?.TotalRecovered)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default App;
