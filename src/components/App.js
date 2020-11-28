import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
const ipfsClient = require('ipfs-api')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      buffer: null, 
      imageHash : ""
    }; 
  }
  captureFile = (event)=>{
    event.preventDefault();
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () =>{
      this.setState({buffer: Buffer.from(reader.result)})
    }
  }
  onSubmitClick = async (event)=>{
      event.preventDefault()
      console.log("Submitting File");
      if(this.state.buffer){
        const file = await ipfs.add(this.state.buffer)
        // console.log(this.state.buffer)
        const imageHash = file[0]["hash"]

        this.setState({imageHash: imageHash})
        console.log(this.state.imageHash)
      }
    }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.imageHash}`} className="App-logo" alt="logo" />
                </a>
                <h2>Change File</h2>
                <form>
                  <input type="file" onChange={this.captureFile}></input>
                  <input type="submit" onClick={this.onSubmitClick}></input>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
 