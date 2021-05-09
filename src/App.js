import React,{useState,useEffect} from "react";
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from "./util";
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] =useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 13, lng: 100 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);



  useEffect(()=>{
    const getCountriseData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((Response)=>Response.json())
      .then((data)=>{
        const countries=data.map((country)=>({
          name: country.country,
          value: country.countryInfo.iso2,
        }));


        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriseData();
  },[]);

  const onCountryChange = async (event)  =>{
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
   
      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
          setCountry(countryCode);
          setCountryInfo(data);
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        });
        
  };





  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
      <h1>Covid 19 Trackers</h1>
       <FormControl className="app__dropdown">
            <Select variant="outlined" onChange ={onCountryChange} value={country}>
              <MenuItem value="worldwide">worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
           </Select>
          </FormControl>
      </div>

      <div className="app__stats">
        <InfoBox
         title="Coronavirus cases" 
         cases={countryInfo.todayCases} 
         total={countryInfo.cases}
         />

        <InfoBox 
        title="Recovered" 
        cases={countryInfo.todayRecovered} 
        total={countryInfo.recovered}
        />

        <InfoBox
         title="Deaths" 
         cases={countryInfo.todayDeaths} 
         total={countryInfo.deaths}
         />

      </div>
      <Map 
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
      casesType={casesType}
      />
      
      </div>
      <Card className="app_right">
          <CardContent>
            <h3>Live Cases by country</h3>
            <Table countries={tableData} />
            <h3></h3>
              
          </CardContent>
      </Card>


    </div>
  );
}
                  
export default App;
