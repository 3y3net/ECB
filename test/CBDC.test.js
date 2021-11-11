const Token = artifacts.require("CBDC");

var chai = require("chai");

const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract("Token Test", async accounts => {
    const [ initialHolder, recipient, anotherAccount ] = accounts;


    it("All tokens should be in my account", async () => {
    let instance = await Token.deployed();
    let totalSupply = await instance.totalSupply();
    await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("I can send tokens from Account 1 to Account 2", async () => {
        const sendTokens = 1;
        let instance = await Token.deployed();
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;      
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        await expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
      });
  
  
      it("It's not possible to send more tokens than account 1 has", async () => {
        let instance = await Token.deployed();
        let balanceOfAccount = await instance.balanceOf(initialHolder);
        await expect(instance.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;
  
        //check if the balance is still the same
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAccount);
  
      });

      it("Owner can mint tokens", async () => {
        const mintedTokens = 100;
        let instance = await Token.deployed();
        let initialHolderSupply = await instance.balanceOf(initialHolder);
        await expect(instance.mint(initialHolder, mintedTokens)).to.eventually.be.fulfilled;      
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(initialHolderSupply.add(new BN(mintedTokens)));
      });

      it("Only MINTER_ROLE can mint tokens", async () => {
        const mintedTokens = 100;
        let instance = await Token.deployed();
        await expect(instance.mint(initialHolder, mintedTokens, {from: accounts[1]})).to.eventually.be.rejected;
      });

      it("Owner may assign MINTER_ROLE to other account", async () => {
        const mintedTokens = 100;
        const MINTER_ROLE = web3.utils.soliditySha3('MINTER_ROLE');
        let instance = await Token.deployed();
        await expect(instance.grantRole(MINTER_ROLE, accounts[1])).to.eventually.be.fulfilled;
        await expect(instance.mint(initialHolder, mintedTokens, {from: accounts[1]})).to.eventually.be.fulfilled;
      });

      it("Owner can burn tokens", async () => {
        const burnedTokens = 100;
        let instance = await Token.deployed();
        let initialHolderSupply = await instance.balanceOf(initialHolder);
        await expect(instance.burn(burnedTokens)).to.eventually.be.fulfilled;      
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(initialHolderSupply.sub(new BN(burnedTokens)));
      });

      it("Only BURNER_ROLE can burn tokens", async () => {
        const burnedTokens = 100;
        let instance = await Token.deployed();
        await expect(instance.burn(burnedTokens, {from: accounts[1]})).to.eventually.be.rejected;
      });

      it("Owner may assign BURNER_ROLE to other account", async () => {
        const burnedTokens = 1;
        const BURNER_ROLE = web3.utils.soliditySha3('BURNER_ROLE');
        let instance = await Token.deployed();
        await expect(instance.grantRole(BURNER_ROLE, accounts[1])).to.eventually.be.fulfilled;
        await expect(instance.burn(burnedTokens, {from: accounts[1]})).to.eventually.be.fulfilled;
      });
});