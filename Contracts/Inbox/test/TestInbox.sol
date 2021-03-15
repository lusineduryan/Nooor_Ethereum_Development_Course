pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Inbox.sol";

contract TestInbox {
    function testItStoresAValue() public {
        Inbox inbox = Inbox(DeployedAddresses.Inbox());

        inbox.set("Nooor");

        string memory expected = "Nooor";

        Assert.equal(
            inbox.get(),
            expected,
            "It should store the value 'Nooor'."
        );
    }
}
