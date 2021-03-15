const LotteryModified = artifacts.require("./LotteryModified.sol");

contract("LotteryModified", accounts => {
  let lotteryModifiedInstance;

  beforeEach(async () => {
    lotteryModifiedInstance = await LotteryModified.deployed();
  })

  it('deploys a contract', async () => {
		assert(lotteryModifiedInstance);
	});

  /*it("allows a player to enter the contract", async () => {
    await lotteryModifiedInstance.enterLottery({
      from: accounts[1],
      value: web3.utils.toWei("0.025", "ether")
    });

    const players = await lotteryModifiedInstance.getPlayers({
      from: accounts[0]
    });

    assert.equal(accounts[1], players[0], "player did not enter the lottery");
  });*/

  it("allows multiple players to enter the lottery", async () => {
    await lotteryModifiedInstance.enterLottery({
      from: accounts[1],
      value: web3.utils.toWei("10", "ether")
    });

    await lotteryModifiedInstance.enterLottery({
      from: accounts[2],
      value: web3.utils.toWei("10", "ether")
    });

    const players = await lotteryModifiedInstance.getPlayers({
      from: accounts[0]
    });

    assert.equal(accounts[1], players[0], "player 1 did not enter the lottery");
    assert.equal(accounts[2], players[1], "player 2 did not enter the lottery");
    
  });

  it('Should pass the double input as a prize to the winner and reset players', async () => {
    await lotteryModifiedInstance.enterLottery({
      from: accounts[1],
      value: web3.utils.toWei("1", "ether")
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await lotteryModifiedInstance.pickWinner({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;
    const players = await lotteryModifiedInstance.getPlayers({
      from: accounts[0]
    });
    assert(difference > web3.utils.toWei("1.6", "ether"), "winner didn't receive the prize pool");
    console.log(difference);
    assert.equal(players.length, 0, "players didn't reset");
  });

  it('Should leave 10% to the contract', async () => {
    await lotteryModifiedInstance.enterLottery({
      from: accounts[1],
      value: web3.utils.toWei("1", "ether")
    });

    const initialContractBalance = await lotteryModifiedInstance.getContractBalance();
    console.log(initialContractBalance);
    await lotteryModifiedInstance.pickWinner({
      from: accounts[0]
    });
    const finalContractBalance = await lotteryModifiedInstance.getContractBalance();
    console.log(finalContractBalance);
    const dif = initialContractBalance - finalContractBalance;
    console.log(dif);
    assert(dif > web3.utils.toWei("1.7", "ether"), "contract didn't get the 10% fee");
  })


});
