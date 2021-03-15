pragma solidity 0.7.4;

contract Lottery {
    address public manager;
    address payable[] public players;
    
    constructor() {
        manager = msg.sender;
    }
    
    function enter() public onlyPlayer("Manager can't enter the lottery") payable {
        require(msg.value > 0.01 ether, "Ether vlaue should be bigger than 0.01 to enter the lottery");
        players.push(msg.sender);
    }
    
    function notReallyRandom() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function getPrizePool() public view onlyManager("Restricted to manager only") returns(uint) {
        return address(this).balance;
    }
    
    function pickWinner() public onlyManager("Winner can be picked only by manager") returns (address) {
        address payable winner = players[notReallyRandom()%players.length];
        winner.transfer(getPrizePool());
        players = new address payable[](0);
        return winner;
    }

    function getPlayers() public view onlyManager("Only manager can get the list of players!!!") returns (address payable [] memory) {
      return players;
    }
    
    modifier onlyManager(string memory message) {
      require(msg.sender == manager, message);
      _;
    }
    
    modifier onlyPlayer(string memory message) {
      require(msg.sender != manager, message);
      _;
    }
}
