// src/App.js
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { formatEther, isAddress } from "ethers";
import { provider } from "./ethereum";

const App = () => {
	const [walletAddress, setWalletAddress] = useState("");
	const [balance, setBalance] = useState(0);
	const [transactions, setTransactions] = useState([]);
	const [hasMetaMask, setHasMetaMask] = useState(false);
	const [metaMaskAddress, setMetaMaskAddress] = useState(null);
	const [isAddressValid, setIsAddressValid] = useState(true);

	useEffect(() => {
		// Detect MetaMask
		if (window.ethereum) {
			setHasMetaMask(true);
		}
	}, []);

	useEffect(() => {
		if (walletAddress && isAddress(walletAddress)) {
			// Fetch wallet balance and transactions only if the address is valid
			const fetchBalanceAndTransactions = async () => {
				try {
					const balance = await provider.getBalance(walletAddress);
					setBalance(formatEther(balance));

					const history = await provider.getHistory(walletAddress);
					setTransactions(history);
				} catch (error) {
					console.error("Error fetching data:", error);
					setBalance(0);
					setTransactions([]);
				}
			};

			fetchBalanceAndTransactions();
		}
	}, [walletAddress]);

	const connectMetaMask = async () => {
		if (window.ethereum) {
			try {
				const accounts = await window.ethereum.request({
					method: "eth_requestAccounts",
				});
				const address = accounts[0];
				setMetaMaskAddress(address);
				setWalletAddress(address);
				console.log("Connected MetaMask address:", address);
			} catch (error) {
				console.error("Failed to connect MetaMask:", error);
			}
		}
	};

	const handleAddressChange = (event) => {
		const address = event.target.value;
		setWalletAddress(address);
		setIsAddressValid(isAddress(address)); // Validate the address format
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Donation Platform</h1>

			<div>
				{hasMetaMask && (
					<button onClick={connectMetaMask}>
						{metaMaskAddress
							? "Connected: " + metaMaskAddress
							: "Connect MetaMask"}
					</button>
				)}
			</div>

			<div>
				<label htmlFor="walletAddress">Enter Wallet Address:</label>
				<input
					type="text"
					id="walletAddress"
					value={walletAddress}
					onChange={handleAddressChange}
					placeholder="0x1234..."
					style={{ width: "300px", marginLeft: "10px" }}
				/>
				{!isAddressValid && walletAddress && (
					<p style={{ color: "red" }}>
						Invalid Ethereum address format.
					</p>
				)}
			</div>

			{isAddressValid && walletAddress && (
				<div>
					<p>Donate to this address using the QR code below:</p>
					<QRCode value={walletAddress} size={256} />
					<h2>Wallet Balance: {balance} ETH</h2>
					<h3>Recent Transactions:</h3>
					{transactions.length > 0 ? (
						<ul>
							{transactions.map((tx) => (
								<li key={tx.hash}>
									<a
										href={`https://etherscan.io/tx/${tx.hash}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{tx.hash.slice(0, 6)}...
										{tx.hash.slice(-4)}
									</a>{" "}
									- {formatEther(tx.value)} ETH
								</li>
							))}
						</ul>
					) : (
						<p>No transactions found.</p>
					)}
				</div>
			)}
		</div>
	);
};

export default App;
