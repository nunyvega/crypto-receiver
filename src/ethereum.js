// src/ethereum.js
import { JsonRpcProvider, Wallet } from "ethers";

// Access environment variables
const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;

// Connect to Ethereum network
const provider = new JsonRpcProvider(
	`https://sepolia.infura.io/v3/${infuraProjectId}`
);

// Create or use an existing wallet
const wallet = new Wallet(privateKey, provider);

// Export the wallet and provider
export { wallet, provider };
