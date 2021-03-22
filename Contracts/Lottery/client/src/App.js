import React, { Component } from 'react';
import LotteryContract from './contracts/Lottery.json';
import getWeb3 from './getWeb3';

import './App.css';

class App extends Component {
	state = {
    prizePool: '', 
    web3: null,
		paidAmount: 0,
    accounts: null, 
    contract: null,
    playerCount: 0,
		winner: 'No one yet!',
    isLoading: false 
  };

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = LotteryContract.networks[networkId];
			const contract = new web3.eth.Contract(
				LotteryContract.abi,
				deployedNetwork && deployedNetwork.address
			);

      const manager = await contract.methods.manager().call();
      const prizePool = await contract.methods.getPrizePool().call();
      const playerCount = (await contract.methods.getPlayers().call()).length;

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract, deployedAddress: deployedNetwork.address, prizePool, manager, playerCount });
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(`Failed to load web3, accounts, or contract. Check console for details.`);
			console.error(error);
		}
	};

	enterLottery = async () => {
		const { accounts, contract, web3, paidAmount } = this.state;
    
		// Stores a given value, 5 by default.
    this.setState({ isLoading: true});
		const tx = await contract.methods.enter().send({ from: accounts[0], value: web3.utils.toWei(paidAmount, "ether") });

		// Get the value from the contract to prove it worked.
		const prizePool = await contract.methods.getPrizePool().call();
		const playerCount = (await contract.methods.getPlayers().call()).length;
    console.log(tx)
		// Update state with the result.
		this.setState({ prizePool, playerCount, transactionHash: tx.transactionHash, isLoading: false });
	};

	pickWinner = async () => {
		try {
			const { accounts, contract } = this.state;

			const tx = await contract.methods.pickWinner().send({from: accounts[0] });
			console.log(tx);
			// const winner = await contract.methods.winner().call();
			const prizePool = await contract.methods.getPrizePool().call();
			// console.log(winner);
			this.setState({ prizePool });
		} catch(err) {
			console.log(err);
		}
	}

	handleInput = (event) => {
		this.setState({
			paidAmount: event.currentTarget.value,
		});
	};

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App">
				<div>Deployed contract address: {this.state.deployedAddress}</div>
				<div>Manager address: {this.state.isLoading ? "Loading..." : this.state.manager}</div>
        <div>Prize Pool: {this.state.prizePool}</div>
        <div>Player count: {this.state.playerCount}</div>
				<div>Latest Transaction Hash: <a target="_blank" href={`https://ropsten.etherscan.io/tx/${this.state.transactionHash}`}>{this.state.transactionHash}</a></div>
				<div>
					<input type="number" min="1" onChange={this.handleInput} placeholder="Enter ether amount" />
					<button onClick={this.enterLottery}>Enter Lottery</button>
				</div>
				<br />
				Time to pick the winner!!!
				<button onClick={this.pickWinner}>Pick Winner</button>
				<div>The winner is: {this.state.winner}</div>
			</div>
		);
	}
}

export default App;