import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      title: "James is currently:",
      status: ["building a react", "app!"]
    };

    this.wrap = this.wrap.bind(this);
    this.EditStatus = this.EditStatus.bind(this);
    this.processStatus = this.processStatus.bind(this);
  }

  componentDidMount(){
     fetch('/api/status')
     .then((response) => response.json())
     .then((responseJson) => {
      var processedStatus = this.processStatus(responseJson.status);
      this.setState({
        status: processedStatus.array
      });
      console.log("Set initial status to: " + processedStatus.final);

     });
  }

  wrap(text, limit) {
    if (text.length > limit) {
      // find the last space within limit
      var edge = text.slice(0, limit).lastIndexOf(' ');
      if (edge > 0) {
        var line = text.slice(0, edge);
        var remainder = text.slice(edge + 1);
        return [line].concat(this.wrap(remainder, limit));
      }
    }
    return [text];
  }

  processStatus(statusMessage){
    var wrappedStatus = this.wrap(statusMessage, 20);
    let finalStatus = "";
    let finalStatusArray = ["", ""];
    if (wrappedStatus.length > 1) {
      finalStatusArray = [wrappedStatus[0], wrappedStatus[1]];
      finalStatus = wrappedStatus[0] + " " + wrappedStatus[1];
    } else {
      finalStatusArray = [wrappedStatus[0], ""];
      finalStatus = wrappedStatus[0];
    }
    return {
      "final" : finalStatus,
      "array" : finalStatusArray
    }
  }


  EditStatus() {
    var statusMessage = window.prompt("New Status:", "Making a cup of tea!");
    if (statusMessage && statusMessage.length !== 0) {
      var processedStatus = this.processStatus(statusMessage);

      this.setState({
        status: processedStatus.array
      });
      console.log("Updated status to: " + processedStatus.final);

      fetch('api/status', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: processedStatus.final
        })
      });
    }
  }
  render() {




    return (
      <div className="App">
        { /* SVG of Status display */}
        <div className="statusSVG">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="212" height="104" onClick={this.EditStatus}>
            <defs>
              <style type="text/css">@import url('http://fonts.googleapis.com/css?family=Fredoka+One');</style>
            </defs>
            <g >
              <rect x="0" y="0" width="212" height="36" fill="#C12242" />
              <text x="106" y="18" fontFamily="Fredoka One" fontSize="21" fill="#FFFFFF" textAnchor="middle" alignmentBaseline="central">{this.state.title}</text>
              <text x="106" y="50" fontFamily="Fredoka One" fontSize="21" fill="#000000" textAnchor="middle" alignmentBaseline="central">{this.state.status[0]}</text>
              <text x="106" y="80" fontFamily="Fredoka One" fontSize="21" fill="#000000" textAnchor="middle" alignmentBaseline="central">{this.state.status[1]}</text>
              <rect x="0" y="96" width="212" height="8" fill="#C12242" />
            </g>
          </svg>
          </div>
      </div>
    );
  }
}

export default App;
