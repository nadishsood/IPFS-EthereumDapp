import React, { Component } from 'react';
// import Web3 from "web3";
import Image from '../abis/Image.json'



import logo from '../logo.png';
import './App.css';
const ipfsClient = require('ipfs-api')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
var Web3 = require('web3');



class App extends Component {

  

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }





  async loadWeb3() {
    // if (window.ethereum) {
    //   App.web3Provider = window.ethereum;
    //   try {
    //     // Request account access
    //     await window.ethereum.enable();
    //   } catch (error) {
    //     // User denied account access...
    //     console.error("User denied account access")
    //   }
    // }
    // // Legacy dapp browsers...
    // else if (window.web3) {
    //   App.web3Provider = window.web3.currentProvider;
    // }
    // // If no injected web3 instance is detected, fall back to Ganache
    // else {
    //   App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    // }

    // var web3 = new Web3(App.web3Provider);

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }


  
  }


  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Image.networks[networkId]
    if(networkData) {
      const contract = new web3.eth.Contract(Image.abi, networkData.address)
      this.setState({ contract })
      const imageHash = await contract.methods.get().call()
      console.log(imageHash);
      this.setState({ imageHash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  // async loadBlockchainData(){
  //   const web3 = window.web3;
  //   let a;
  //   let netAddr;

  //   await window.ethereum.enable();
   

  // var account = null;
  // web3.eth.getAccounts((error, accounts) => {
  //     if (error == null && accounts.length > 0) {
  //         this.setState({account: accounts[0]})
          
  //     }
  //   })

  //   console.log(this.state.account)

    

  //   web3.eth.net.getId((e, netID)=>{
  //     this.setState({netAddr: netID})
  //     console.log(this.state.netAddr)
  //   })

  //   console.log(this.state.netAddr)
    
    

  // }


  constructor(props){
    super(props);
    this.state = {
      imageHash: '',
      contract: null,
      web3: null,
      buffer: null,
      account: null

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

        
        this.state.contract.methods.set(imageHash).send({from: this.state.account}).then((r)=>{
          this.setState({imageHash: imageHash})
        })
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
                <div>
                  <p>
                  {this.state.account}
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
 