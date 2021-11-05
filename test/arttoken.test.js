const ArtToken = artifacts.require("ArtToken");
const truffleAssert = require('truffle-assertions');


contract("TreeToken", function(accounts){
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

    it("Owner should be able to set token uri", async ()=>{
        const setUriPromises = paintingIds.map((id)=>instance.setUri(id, `https://addresstotoken${id}.json`));
        await Promise.all(setUriPromises);
        const getUriPromises = paintingIds.map((id)=>instance.uri(id));
        const uris = await Promise.all(getUriPromises);
        console.log(uris);
        for(let i=0; i<paintingIds.length; ++i ){
            assert.equal(uris[i], `https://addresstotoken${paintingIds[i]}.json`);
        }
    });

    it("uri should not be changed after set", async ()=>{
        const firstPaintingId = paintingIds[0];
        await truffleAssert.reverts(
            instance.setUri(firstPaintingId, "https://somethingelse.json"),
            "This uri has already been set"
        );
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





})