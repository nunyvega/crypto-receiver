// src/App.js
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { formatEther, isAddress } from "ethers";
import { provider } from "./ethereum";
import axios from "axios";
import "./App.css"; // Import the component-specific styles

const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
const COINBASE_CHECKOUT_ID = process.env.REACT_APP_COINBASE_CHECKOUT_ID;
const App = () => {
	const [walletAddress, setWalletAddress] = useState("");
	const [balance, setBalance] = useState(0);
	const [transactions, setTransactions] = useState([]);
	const [hasMetaMask, setHasMetaMask] = useState(false);
	const [metaMaskAddress, setMetaMaskAddress] = useState(null);
	const [isAddressValid, setIsAddressValid] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Modal and overlay styles
	const modalStyles = {
		position: "fixed",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "80%",
		height: "80%",
		backgroundColor: "#fff",
		boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
		zIndex: 1001,
		overflow: "hidden",
		borderRadius: "8px",
	};

	const overlayStyles = {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		zIndex: 1000,
	};

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
					// Fetch balance using ethers.js provider
					const balance = await provider.getBalance(walletAddress);
					setBalance(formatEther(balance));

					// Fetch transaction history using Etherscan API
					const response = await axios.get(
						`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`
					);

					if (response.data.status === "1") {
						setTransactions(response.data.result);
					} else {
						setTransactions([]);
					}
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

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<div className="app-container">
			<h1>Donation Platform</h1>

			<div>
				{hasMetaMask && (
					<button className="button" onClick={connectMetaMask}>
						{metaMaskAddress
							? "Connected: " + metaMaskAddress
							: "Connect MetaMask"}
					</button>
				)}
			</div>

			<div className="input-group">
				<label htmlFor="walletAddress">Enter Wallet Address:</label>
				<input
					type="text"
					id="walletAddress"
					value={walletAddress}
					onChange={handleAddressChange}
					placeholder="0x1234..."
				/>
				{!isAddressValid && walletAddress && (
					<p style={{ color: "red" }}>
						Invalid Ethereum address format.
					</p>
				)}
			</div>

			{isAddressValid && walletAddress && (
				<div>
					<p className="qr-code">
						Donate to this address using the QR code below:
					</p>
					<QRCode value={walletAddress} size={256} />
					<h2>Wallet Balance: {balance} SepoliaETH</h2>
					<h3>Recent Transactions:</h3>
					{transactions.length > 0 ? (
						<ul className="transaction-list">
							{transactions.map((tx) => (
								<li key={tx.hash}>
									<a
										href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{tx.hash.slice(0, 6)}...
										{tx.hash.slice(-4)}
									</a>{" "}
									- {formatEther(tx.value)} SepoliaETH
								</li>
							))}
						</ul>
					) : (
						<p>No transactions found.</p>
					)}
				</div>
			)}

			<div>
				<button className="button" onClick={toggleModal}>
					Donate with coinbase
				</button>
			</div>

			{isModalOpen && (
				<>
					<div style={overlayStyles} onClick={toggleModal}></div>
					<div style={modalStyles}>
						<iframe
							src="https://commerce.coinbase.com/pay/${COINBASE_CHECKOUT_ID}"
							title="Coinbase Checkout"
							width="100%"
							height="100%"
							frameBorder="0"
							style={{ border: "none" }}
						></iframe>
						<button
							className="modal-close-button"
							onClick={toggleModal}
						>
							✖
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default App;
