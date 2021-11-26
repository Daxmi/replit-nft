import { useState, useEffect } from "react";

import myEpicNft from "./utils/MyEpicNFT.json";
import { ethers } from "ethers";

export const FetchData = () => {
    const [currentAccount, setCurrentAccount] = useState("");

    const [currentId, setCurrentId] = useState(0);
    const [link, setLink] = useState("");
    const CONTRACT_ADDRESS = "0xAee69CCea44DbE92a6e84bAbdb3Cf6048a4905cd";


    const checkIfWalletIsConnected = async (missingId) => {
        /*
         * First make sure we have access to window.ethereum
         */
        const { ethereum } = window;
    
        if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }
    
        const accounts = await ethereum.request({ method: "eth_accounts" });
    
        
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
    
          setupEventListener();
        } else {
          console.log("No authorized account found");
        }
      };
    
      // Render Methods
      const connectWallet = async () => {
        try {
          const { ethereum } = window;
    
          if (!ethereum) {
            alert("Get MetaMask!");
            return;
          }
    
          /*
           * Fancy method to request access to account.
           */
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
    
          /*
           * Boom! This should print out public address once we authorize Metamask.
           */
          console.log("Connected", accounts[0]);
          setCurrentAccount(accounts[0]);
    
          setupEventListener();
        } catch (error) {
          console.log(error);
        }
      };
    
      const setupEventListener = async () => {
        // Most of this looks the same as our function askContractToMintNft
        try {
          const { ethereum } = window;
    
          if (ethereum) {
            // Same stuff again
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(
              CONTRACT_ADDRESS,
              myEpicNft.abi,
              signer
            );
    
           
            connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
              // console.log(from, tokenId.toNumber());


              setCurrentId(tokenId.toNumber());

              // alert(
              //   `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://ropsten.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`
              // );
    
              setLink(
                `https://ropsten.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`
              );
            });
    
            console.log("Setup event listener!");
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      const renderNotConnectedContainer = () => (
        <button
          onClick={connectWallet}
          className="cta-button connect-wallet-button"
        >
          Connect to Wallet
        </button>
      );
    
      const askContractToMintNft = async () => {
        try {
          const { ethereum } = window;
          // let chainId = await ethereum.request({ method: "eth_chainId" });
          // console.log("Connected to chain " + chainId);
    
          // // String, hex code of the chainId of the Rinkebey test network
          // const rinkebyChainId = "0x4";
          // if (chainId !== rinkebyChainId) {
          //   alert("You are not connected to the Rinkeby Test Network!");
          // }
    
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(
              CONTRACT_ADDRESS,
              myEpicNft.abi,
              signer
            );
    
            console.log("Going to pop wallet now to pay gas...");
            let nftTxn = await connectedContract.makeAnEpicNFT();
    
            console.log("Mining...please wait.");
            await nftTxn.wait();
    
            console.log(
              `Mined, see transaction: https://ropsten.etherscan.io/tx/${nftTxn.hash}`
            );
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error);
        }
      };


    
      useEffect(() => {

        checkIfWalletIsConnected();

      });

      return { currentId, currentAccount, link, renderNotConnectedContainer, askContractToMintNft }
}