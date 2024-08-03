# Simple Crypto Payments and Donations Platform

This project is a playground for building a platform that facilitates payments and donations in cryptocurrency paying with fiat. Users can input their wallet addresses to generate a QR code that can be used to receive payments or donations. The platform also integrates with MetaMask to automatically detect and use the user's wallet address, providing a seamless user experience.

## Features

-   **Wallet Address Input**: Users can manually enter an Ethereum wallet address.
-   **QR Code Generation**: Generates a QR code for the provided wallet address, allowing for easy payments or donations.
-   **MetaMask Integration**: Detects MetaMask installation and enables users to connect and use their MetaMask wallet address.
-   **Transaction Tracking**: Displays the latest transactions and balance for the specified wallet address.
-   **Address Validation**: Validates the Ethereum wallet address format before generating the QR code and displaying transactions.

### Usage

-   **Manual Wallet Address Entry**: Enter an Ethereum wallet address to generate a QR code and view transactions.
-   **MetaMask Connection**: Click "Connect MetaMask" to use the wallet address from MetaMask.
-   **Address Validation**: Ensure the wallet address is in the correct format to display the QR code and transaction history.

## Built With

-   **React**: JavaScript library for building user interfaces
-   **Ethers.js**: A library for interacting with the Ethereum blockchain
-   **QRCode.react**: A library for generating QR codes in React

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   Thanks to the open-source community for providing great resources and tools.

## Disclaimer

This project is intended for educational and experimental purposes only. Use at your own risk. Ensure that you securely manage any sensitive information, such as private keys, and avoid using this platform in production environments without proper security measures.
