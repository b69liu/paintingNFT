class Web3Manager{
	constructor(url="http://127.0.0.1:7545"){
		this.web3 = new Web3(new Web3.providers.HttpProvider(url));
		this.myContract = new this.web3.eth.Contract(ABI_ARRAY,
			SMART_CONTRACT_ADDRESS);
		this.currentUser = "";
	}



	async getUri(id){
		return this.web3.eth.uri(id);
	}

	async checkBalance(){
		return this.web3.eth.getBalance(this.web3.eth.accounts[0]);
	}

	async setUri(id, uri){
		return this.myContract.methods.setUri(id, uri).send();
	}

	async mintArtToken(firstPaintingId, payment){
		return this.myContract.methods.mintArtToken(firstPaintingId).send({from:this.web3.eth.accounts[0], value:payment})
	}

	
}