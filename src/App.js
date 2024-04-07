import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0xdb86Ba2A0954F2fAf773EB92F366cDD63089D580";

function App() {
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // Added state for network check

  // Check if the current network is the correct network
  useEffect(() => {
    async function checkNetwork() {
      console.log("Checking");
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        console.log(chainId);
        setIsCorrectNetwork(chainId === "0x89"); // Change to the correct chain ID
      }
    }
    //check for initial network
    checkNetwork();

    //Check for network change
    window.ethereum.on("chainChanged", (newChainId) => {
      setIsCorrectNetwork(newChainId === "0x89"); // Change to the correct chain ID
    },[]);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });

  }
  async function displayNFTMetadata(tokenId) {
    try {
        const tokenURI = await NFTContract.tokenURI(tokenId);
        // Make an HTTP request to fetch the metadata JSON file
        const response = await fetch(tokenURI);
        const metadata = await response.json();

        // Now you can use the metadata to display information about the NFT
        console.log(metadata);
        // Update your UI with the metadata information, e.g., set state variables
    } catch (error) {
        console.error("Error fetching or displaying metadata:", error);
        // Handle errors, e.g., show an error message to the user
    }
}
async function handleMint(tokenURI) {
  setIsMinting(true);
  try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);

      console.log("Transaction Hash:", response.hash);
      console.log("Block Number:", response.blockNumber);

      // Display metadata for the newly minted NFT
      await displayNFTMetadata(response.tokenId);

      console.log("Minting successful!");
  } catch (err) {
      alert("Error minting NFT: " + err.message);
  } finally {
      setIsMinting(false);
  }
}

  async function disconnectWallet() {
    if (window.ethereum) {
      try {
        setAccount(null);
      } catch (error) {
        console.error("An error occurred while disconnecting the wallet:", error);
      }
    }
  }

const data = [
    {
      url: "./assets/images/1.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
    {
      url: "./assets/images/2.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
    {
      url: "./assets/images/3.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
    {
      url: "./assets/images/4.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
    {
      url: "./assets/images/5.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
    {
      url: "./assets/images/6.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
    {
      url: "./assets/images/7.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
    {
      url: "./assets/images/8.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
    {
      url: "./assets/images/9.png",
      param: "handleMint('<your_metadata_pinata_link_here>')",
    },
  ];

  async function withdrawMoney() {
    try {
      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
  }

  if (!isCorrectNetwork) {
    return (
      <div className="container">
        <br />
        <h1>TESLA ELECTRIC CAR MARKETPLACE</h1>
        <h2>Switch to the Polygon Mumbai Network</h2>
        <p>Please switch to the Polygon Mumbai network to use this app.</p>
      </div>
    );
  }

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);
  
      console.log("Transaction Hash:", response.hash);
      console.log("Block Number:", response.blockNumber);
      // Add more properties as needed
  
      console.log("Minting successful!");
    } catch (err) {
      alert("Error minting NFT: " + err.message);
    } finally {
      setIsMinting(false);
    }
  }
  

  if (account === null) {
      return (
        <>
          <div className="connect-container">
            <br />
            <h1>TESLA ELECTRIC CAR MARKETPLACE</h1>
            <h2>TESLA Marketplace</h2>
            <p>Buy a Tesla from our marketplace.</p>

            {isWalletInstalled ? (
              <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
            ) : (
              <p>Install Metamask wallet</p>
            )}
          </div>
        </>
    );
  
}

  return (
    <div className="bg">
    <>
      <div className="container">
        <br />

        <h1>Tesla Electric Car Marketplace</h1>
        <p>A Marketplace to buy and own a Tesla</p>
        
        {data.map((item, index) => (
          <div className="imgDiv">
            <img
              src={item.url}
              key={index}
              alt="images"
              width={250}
              height={250}
              border={2}
            />
            <button className="mint_btn"
              isLoading={isMinting}
              onClick={() => {
                handleMint(item.param);
              }}
            >
              Mint - 0.01 MATIC
            </button>
          </div>
        ))}
        <div className="withdraw_container">
        <button className="withdraw_btn"
          onClick={() => {
            withdrawMoney();
          }}
        >
          Withdraw Money from Contract
        </button>
        </div>
        <button className="disconnect-button" onClick={disconnectWallet}>Disconnect Wallet</button>
      </div>
    </>
    
    </div>
    
  );
}

export default App;
