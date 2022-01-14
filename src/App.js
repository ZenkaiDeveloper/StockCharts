import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import Header from './components/Header';
import Chart from './components/Chart';


class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
          url: "",
          dateRange:[],
          wmtClosingPrices: [],
          tgtClosingPrices: [],
          amznClosingPrices: [],
          upsClosingPrices: [],
      };

    this.updateUrl = this.updateUrl.bind(this);

  }

  updateUrl = (url) => {
    this.setState({url}, () => {console.log(this.state.url)});
  }

  componentDidUpdate(prevProps, prevState) {
  if (this.state.url !== prevState.url) {

    const myHeaders = new Headers();
    myHeaders.append("api-token", "1337-time");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(this.state.url, requestOptions)
      .then(response => response.json())
      .then(result => {
        const dateRange = [];
        const wmtClosingPrices = [];
        const tgtClosingPrices= [];
        const amznClosingPrices= [];
        const upsClosingPrices= [];

        for (let key in result) {
          dateRange.push(key);
          for (let ticker in result[key]) {
            switch (ticker) {
              case "WMT":
                wmtClosingPrices.push(result[key][ticker].close);
              break;
              case "TGT":
                tgtClosingPrices.push(result[key][ticker].close);
              break;
              case "AMZN":
                amznClosingPrices.push(result[key][ticker].close);
              break;
              case "UPS":
                upsClosingPrices.push(result[key][ticker].close);
              break;
            }
          }
        }

        this.setState({wmtClosingPrices, tgtClosingPrices, amznClosingPrices, upsClosingPrices, dateRange});

      })
      .catch(error => console.log('error', error));
    }

  }

  showWmtChart = () => {
    if (this.state.wmtClosingPrices !== undefined && this.state.wmtClosingPrices.length > 0){
      return <Chart dateRange={this.state.dateRange} className="stockChart" name="Walmart" color="blue" xVals={this.state.dateRange} yVals={this.state.wmtClosingPrices}  /> ;
    }
  }

  showTgtChart = () => {
    if (this.state.tgtClosingPrices !== undefined && this.state.tgtClosingPrices.length > 0){
      return <Chart dateRange={this.state.dateRange} className="stockChart" color="red"  name="Target" xVals={this.state.dateRange} yVals={this.state.tgtClosingPrices}  /> ;
    }
  }

  showAmznChart = () => {
    if (this.state.amznClosingPrices !== undefined && this.state.amznClosingPrices.length > 0){
      return <Chart dateRange={this.state.dateRange} className="stockChart" color="orange" name="Amazon" xVals={this.state.dateRange} yVals={this.state.amznClosingPrices}  /> ;
    }
  }

  showUpsChart = () => {
    if (this.state.upsClosingPrices !== undefined && this.state.upsClosingPrices.length > 0){
      return <Chart dateRange={this.state.dateRange} className="stockChart" color="brown"  name="UPS" xVals={this.state.dateRange} yVals={this.state.upsClosingPrices}  /> ;
    }
  }

  render() {
    return (
      <div className="App">
        <Header updateUrl={this.updateUrl} />
        <div className = "chartContainer">
          {this.showWmtChart()}
          {this.showTgtChart()}
          {this.showAmznChart()}
          {this.showUpsChart()}
        </div>
      </div>
    );
  }

}

export default App;
