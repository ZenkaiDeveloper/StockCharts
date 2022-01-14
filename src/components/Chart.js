import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import "../styles/Chart.css";


class Chart extends Component {
constructor(props) {
      super(props);
      this.state = {
          isWmtChecked: false,
          isTgtChecked: false,
          isAmzChecked: false,
          isUPSChecked: false,
          displayData: [{
            x: this.props.xVals,
            y: this.props.yVals,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: this.props.color},
          }]
        };

        this.shouldHide = this.shouldHide.bind(this);
  }

  handleChangeCheckbox = e => {
    switch (e.currentTarget.name) {
      case "Walmart":
        this.setState({isWmtChecked: !this.state.isWmtChecked}, () => {});
      break;
      case "Target":
        this.setState({isTgtChecked: !this.state.isTgtChecked}, () => {});
      break;
      case "Amazon":
        this.setState({isAmzChecked: !this.state.isAmzChecked}, () => {});
      break;
      case "UPS":
        this.setState({isUPSChecked: !this.state.isUPSChecked}, () => {});
      break;
    }
  }

  shouldHide = (stock) => {
    if (this.props.name !== undefined) {
      return stock === this.props.name ? {'display':'none'} : {};
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.xVals !== this.props.xVals || prevProps.yVals !== this.props.yVals) {
      this.setState({
        displayData: [{
          x: this.props.xVals,
          y: this.props.yVals,
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: this.props.color},
        }],
        isWmtChecked: false,
        isTgtChecked: false,
        isAmzChecked: false,
        isUPSChecked: false
    })
    }

    if (this.state.isWmtChecked !== prevState.isWmtChecked || this.state.isTgtChecked !== prevState.isTgtChecked
    || this.state.isAmzChecked !== prevState.isAmzChecked || this.state.isUPSChecked !== prevState.isUPSChecked ) {
      this.renderData();
    }

  }


renderData = async () => {
  const tickerArr = [];
  const dataArr = [];
  const baseData = {
    x: this.props.xVals,
    y: this.props.yVals,
    type: 'scatter',
    mode: 'lines+markers',
    marker: {color: this.props.color},
  };
  let wtmData = {};
  let tgtData = {};
  let amznData = {};
  let upsData = {};

  if (this.state.isWmtChecked ) {
    tickerArr.push("wmt")
  }
  if (this.state.isTgtChecked ) {
    tickerArr.push("tgt")
  }
  if (this.state.isAmzChecked ) {
    tickerArr.push("amzn")
  }
  if (this.state.isUPSChecked ) {
    tickerArr.push("ups")
  }

  const tickers = tickerArr.join(",");
  const url = "http://137.184.195.46:8001/api/historical/?ticker=" + tickers + "&from=" + this.props.dateRange[0] +
   "&to=" + this.props.dateRange[this.props.dateRange.length - 1];

  const myHeaders = new Headers();
  myHeaders.append("api-token", "1337-time");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  await fetch(url, requestOptions)
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

      if (wmtClosingPrices.length > 0) {
        wtmData = {
          x: dateRange,
          y: wmtClosingPrices,
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'blue'},
        }
        dataArr.push(wtmData);
      }

      if (tgtClosingPrices.length > 0) {
        tgtData = {
          x: dateRange,
          y: tgtClosingPrices,
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'red'},
        }
        dataArr.push(tgtData);
      }

      if (amznClosingPrices.length > 0) {
        amznData = {
          x: dateRange,
          y: amznClosingPrices,
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'orange'},
        }
        dataArr.push(amznData);
      }

      if (upsClosingPrices.length > 0) {
        upsData = {
          x: dateRange,
          y: upsClosingPrices,
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'brown'},
        }
        dataArr.push(upsData);
      }

    });
    dataArr.push(baseData);
    this.setState({displayData: dataArr});
}


  render() {
    return (
      <div className="chartBannerContainer">

        <div className="chartBanner">
          <p style={{'paddingTop':'.75rem'}} >Add more for same date range?</p>
          <div className="formInputContainer">
            <div style={this.shouldHide('Walmart')}>
              <input checked={this.state.isWmtChecked} onChange={this.handleChangeCheckbox} type="checkbox" id="wmt" name="Walmart"  />
              <label>Walmart</label>
            </div>
            <div style={this.shouldHide('Target')}>
              <input checked={this.state.isTgtChecked} onChange={this.handleChangeCheckbox} type="checkbox" id="tgt" name="Target" />
              <label>Target</label>
            </div>
            <div style={this.shouldHide('Amazon')}>
              <input checked={this.state.isAmzChecked} onChange={this.handleChangeCheckbox} type="checkbox" id="amzn" name="Amazon"  />
              <label>Amazon</label>
            </div>
            <div style={this.shouldHide('UPS')}>
              <input checked={this.state.isUPSChecked} onChange={this.handleChangeCheckbox} type="checkbox" id="ups" name="UPS" />
              <label>UPS</label>
            </div>
          </div>
        </div>
        <div className = "plotDiv">
          <Plot
            data={this.state.displayData}
            layout={
              {
                title: this.props.name + ' Prices',
                autosize: true,
                yaxis: {
                  title: 'Closing Price',
                  tickmode: 'array',
                  titlefont: { size:16 },
                }
              }

            }
          />
        </div>

      </div>
    );
  }
}

export default Chart;
