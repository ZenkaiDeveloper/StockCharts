import React, { Component } from 'react';
import "../styles/Header.css";


class Header extends Component{
  constructor(props) {
      super(props);
      this.state = {
          isWmtChecked: false,
          isTgtChecked: false,
          isAmzChecked: false,
          isUPSChecked: false,
          fromDate: "2018-07-22",
          toDate: "2018-07-23"
        };
    }

  handleChangeCheckbox = e => {
    switch (e.currentTarget.name) {
      case "Walmart":
        this.setState({isWmtChecked: !this.state.isWmtChecked}, () => {this.constructUrl()});
      break;
      case "Target":
        this.setState({isTgtChecked: !this.state.isTgtChecked}, () => {this.constructUrl()});
      break;
      case "Amazon":
        this.setState({isAmzChecked: !this.state.isAmzChecked}, () => {this.constructUrl()});
      break;
      case "UPS":
        this.setState({isUPSChecked: !this.state.isUPSChecked}, () => {this.constructUrl()});
      break;
    }
  }

  handleChangeDate = e => {
    switch (e.currentTarget.name) {
      case "from":
        this.setState({fromDate: e.currentTarget.value}, () => {this.constructUrl()});
      break;
      case "to":
        this.setState({toDate: e.currentTarget.value}, () => {this.constructUrl()});
      break;
    }
  }

  constructUrl = () => {
    const tickerArr = [];
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
    const url = "http://137.184.195.46:8001/api/historical/?ticker=" + tickers + "&from=" + this.state.fromDate + "&to=" + this.state.toDate;
    this.props.updateUrl(url);
  }

  render(){
    return(
      <div>

        <h1>Stock Charts</h1>
        <nav className="navbar">
          <div className="checkboxContainer">
            <div className = "checkboxOne checkBoxWrapper">
              <input checked={this.state.isWmtChecked} onChange={this.handleChangeCheckbox} type="checkbox" id="wmt" name="Walmart"  />
              <label>Walmart</label>
            </div>
            <div className = "checkboxTwo checkBoxWrapper">
              <input checked={this.state.isTgtChecked} onChange={this.handleChangeCheckbox} type="checkbox" id="tgt" name="Target" />
              <label>Target</label>
            </div>
            <div className = "checkboxThree checkBoxWrapper">
              <input checked={this.state.isAmzChecked} onChange={this.handleChangeCheckbox} type="checkbox" id="amzn" name="Amazon"  />
              <label>Amazon</label>
            </div>
            <div className = "checkboxFour checkBoxWrapper">
              <input checked={this.state.isUPSChecked} onChange={this.handleChangeCheckbox} type="checkbox" id="ups" name="UPS" />
              <label>UPS</label>
            </div>
          </div>

          <div className="dateContainer">

            <div className = "fromWrapper">
              <label>From:</label>
              <input type="date" id="from" name="from" onChange={this.handleChangeDate} value={this.state.fromDate} min="2017-01-01" max="2021-12-30" />
            </div>



            <div className = "toWrapper">
              <label>To:</label>
              <input type="date" id="to" name="to" onChange={this.handleChangeDate} value={this.state.toDate} min="2017-01-02" max="2021-12-31" />
            </div>

          </div>




        </nav>
      </div>
    );
  }
}

export default Header
