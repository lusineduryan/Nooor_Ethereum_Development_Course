const Lottery = artifacts.require("./Lottery.sol");

contract("Lottery", (accounts) => {
  let lotteryInstance;

  beforeEach(async () => {
    lotteryInstance = await Lottery.deployed();
  })

  it('deploys a contract', async () => {
		assert(lotteryInstance);
	});

  it("allows a player to enter the contract", async () => {
    await lotteryInstance.enter({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether")
    });

    const players = await lotteryInstance.getPlayers({
      from: accounts[0]
    });

    assert.equal(accounts[1], players[0], "player did not enter the lottery");
  });

  it("allows multiple players to enter the lottery", async () => {
    await lotteryInstance.enter({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether")
    });

    await lotteryInstance.enter({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether")
    });

    await lotteryInstance.enter({
      from: accounts[3],
      value: web3.utils.toWei("0.02", "ether")
    });

    const players = await lotteryInstance.getPlayers({
      from: accounts[0]
    });

    assert.equal(accounts[1], players[0], "player 1 did not enter the lottery");
    assert.equal(accounts[2], players[1], "player 2 did not enter the lottery");
    assert.equal(accounts[3], players[2], "player 3 did not enter the lottery");
  });

  it('Should pass the prize pool to the winner and reset players', async () => {
    await lotteryInstance.enter({
      from: accounts[1],
      value: web3.utils.toWei("2", "ether")
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await lotteryInstance.pickWinner({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;
    const players = await lotteryInstance.getPlayers({
      from: accounts[0]
    });
    assert(difference > web3.utils.toWei("1.8", "ether"), "winner didn't receive the prize pool");
    assert.equal(players.length, 0, "players didn't reset");
  });

  it('requires a minimum amount of ether to enter', async () => {
		try {
			await lotteryInstance.enter({
				from: accounts[1],
				value: 0
			});
			assert(false);
		} catch(err) {
			assert(err);
		}
	});
})