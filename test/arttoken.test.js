const ArtToken = artifacts.require("ArtToken");
const truffleAssert = require('truffle-assertions');


contract("ArtToken", function(accounts){
    let instance;
    const paintingIds = [0,1,2,3,4,5];
    const UNIT_PRICE = 1000000;
    const MAX_MINT = 100;

    before(async () =>{
        instance = await ArtToken.deployed();
    });

    it("should have the contract owner address", async ()=>{
        const owner = await instance.owner();
        assert.equal(owner, accounts[0]);
    });

    it("Owner should be able to get token uris", async ()=>{
        const getUriPromises = paintingIds.map((id)=>instance.uri(id));
        const uris = await Promise.all(getUriPromises);
        console.log(uris);
        for(let i=0; i<paintingIds.length; ++i ){
            assert.equal(uris[i], `https://addresstotoken${paintingIds[i]}.json`);
        }
    });



    it("should let user mint token", async ()=>{
        const firstPaintingId = paintingIds[0];
        const amountToBuy = 5;
        const payment = UNIT_PRICE * amountToBuy;
        const payer = accounts[1];
        await instance.mintArtToken(firstPaintingId,{from: payer, value: payment});
        let firstPaintingBalance =  instance.balanceOf(payer, firstPaintingId);
        let firstPpaintingCount =  instance.paintingsCount(firstPaintingId);
        [firstPaintingBalance, firstPpaintingCount] = await Promise.all([firstPaintingBalance, firstPpaintingCount]);
        assert.equal(firstPaintingBalance, amountToBuy);
        assert.equal(firstPpaintingCount, amountToBuy);
    });

    it("should not exceed MAX_MINT", async ()=>{
        const firstPaintingId = paintingIds[0];
        const amountToBuy = MAX_MINT - 3;
        const payment = UNIT_PRICE * amountToBuy;
        const payer = accounts[1];

        await truffleAssert.reverts(
            instance.mintArtToken(firstPaintingId,{from: payer, value: payment}),
            "This painting has reached max mint"
        );
    });

    it("should not mint non-existing painting", async ()=>{
        const firstPaintingId = 7;
        const amountToBuy = 1;
        const payment = UNIT_PRICE * amountToBuy;
        const payer = accounts[1];

        await truffleAssert.reverts(
            instance.mintArtToken(firstPaintingId,{from: payer, value: payment}),
            "Painting ID is out of range"
        );
    });

    it("should get all my balances", async ()=>{
        const myBalances = await instance.getMyBalances({from: accounts[1]});
        assert.equal(myBalances.length, 6);
        assert.equal(web3.utils.toBN(myBalances[0]).toString(), "5");
        assert.equal(web3.utils.toBN(myBalances[1]).toString(), "0");
        assert.equal(web3.utils.toBN(myBalances[2]).toString(), "0");
        assert.equal(web3.utils.toBN(myBalances[3]).toString(), "0");
        assert.equal(web3.utils.toBN(myBalances[4]).toString(), "0");
        assert.equal(web3.utils.toBN(myBalances[5]).toString(), "0");
    });

    it("should allow user to transfer", async ()=>{
        const firstPaintingId = paintingIds[0];
        const payer = accounts[1];
        const receiver = accounts[2];
        const payerOldPaintingBalance =  await instance.balanceOf(payer, firstPaintingId);
        await instance.safeTransferFrom(payer, receiver, 0, 1,"0x0",{from: payer});
        const payerNewPaintingBalance =  await instance.balanceOf(payer, firstPaintingId);
        const receiverNewPaintingBalance =  await instance.balanceOf(receiver, firstPaintingId);
        assert.equal(payerNewPaintingBalance, payerOldPaintingBalance-1);
        assert.equal(receiverNewPaintingBalance, 1);

    });





})