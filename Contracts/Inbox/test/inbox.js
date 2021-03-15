const Inbox = artifacts.require('./Inbox.sol');

contract('Inbox', (accounts) => {
	it('...should store the value "Nooor".', async () => {
		const InboxInstance = await Inbox.deployed();

		// Set value of 89
		await InboxInstance.set('Nooor', { from: accounts[0] });

		// Get stored value
		const storedData = await InboxInstance.get.call();

		assert.equal(storedData, 'Nooor', 'The value "Nooor" was not stored.');
	});
});
