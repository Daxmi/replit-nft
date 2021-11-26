import React from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";

import { FetchData } from "./FetchData";

const TWITTER_HANDLE = "mazidavid_OG";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TOTAL_MINT_COUNT = 50;

const App = () => {

  const { currentId, currentAccount, link, renderNotConnectedContainer, askContractToMintNft } = FetchData();


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <p className="sub-text">
            {currentId}/{TOTAL_MINT_COUNT} NFTs minted so far
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
          {link !== "" && (
            <button className="cta-button connect-wallet-button">
              <a
                className="footer-text"
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                Visit your link
              </a>
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
