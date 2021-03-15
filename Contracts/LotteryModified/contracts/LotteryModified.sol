// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

contract LotteryModified {
  
  address public manager;
  mapping(address => uint) public playersAndInputs;
  address payable[] public players;
  
  constructor() {
    manager = msg.sender;
  }

  function enterLottery() public payable {
    require(msg.value >= 0.02 ether, "Your input should be at least 0.02 ETH");
    players.push(msg.sender);
    playersAndInputs[msg.sender] = msg.value;
  }

  function notReallyRandom() private view returns(uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
  }

  function pickWinner() public {
    address payable winnerAddress = players[notReallyRandom()%players.length];
    uint winnerInput = playersAndInputs[winnerAddress];
    uint prize = uint((2 * winnerInput) * 9 / 10); 
    winnerAddress.transfer(prize);
    players = new address payable[](0);
  }

  function getPlayers() public view returns (address payable [] memory) {
    return players;
  }

  function getContractBalance() public view returns (uint) {
    return address(this).balance;
  }
}
