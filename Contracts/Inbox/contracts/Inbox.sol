// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Inbox {
    string message;

    constructor(string memory initialMessage) public {
        message = initialMessage;
    }

    function set(string memory x) public {
        message = x;
    }

    function get() public view returns (string memory) {
        return message;
    }
}
