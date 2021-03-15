pragma solidity 0.7.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Lottery.sol";

contract TestLottery {
  uint public initialBalance = 1 ether;
  //address manager = []
  //address[] accounts = web3.eth.getAccounts();
  /*function testItShouldDeploy() public pure {
    Assert(DeployedAddresses.Lottery());
  }*/

  //beforeEach

  function testItAllowsPlayerEnter() public {
    Lottery lottery = Lottery(DeployedAddresses.Lottery());
    lottery.enter{value: 0.02 ether}();
    address payable[] memory players = lottery.manager.getPlayers();
    Assert.equal(msg.sender, players[0], 'player did not enter the lottery');
  }
}