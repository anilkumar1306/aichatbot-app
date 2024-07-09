import { ethers } from 'ethers';
import React, { useState } from 'react';

const SendSepolia = () => {
  const [senderPrivateKey, setSenderPrivateKey] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const sendSepolia = async () => {
    try {
      // Connect to Sepolia using Infura
      const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/427b470c4a084e9f857e777d1261a9dd');

      // Create wallet from private key
      const wallet = new ethers.Wallet(senderPrivateKey, provider);

      // Define receiver address and amount to send (in wei)
      const tx = {
        to: receiverAddress,
        value: ethers.utils.parseEther(amountToSend) // Convert ETH to wei
      };

      // Send transaction
      const txResponse = await wallet.sendTransaction(tx);

      // Set transaction hash to state
      setTransactionHash(txResponse.hash);
    } catch (error) {
      console.error('Error sending Sepolia ethers:', error.message);
    }
  };

  return (
    <div>
      <h2>Send Sepolia Ethers</h2>
      <label>Sender Private Key:</label>
      <input type="text" value={senderPrivateKey} onChange={(e) => setSenderPrivateKey(e.target.value)} /><br />
      <label>Receiver Address:</label>
      <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} /><br />
      <label>Amount to Send (ETH):</label>
      <input type="text" value={amountToSend} onChange={(e) => setAmountToSend(e.target.value)} /><br />
      <button onClick={sendSepolia}>Send Sepolia Ethers</button><br />
      {transactionHash && (
        <div>
          Transaction Hash: {transactionHash}
        </div>
      )}
    </div>
  );
};

export default SendSepolia;
