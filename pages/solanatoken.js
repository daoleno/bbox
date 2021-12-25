import { useState } from "react";
import Notify from "../components/Notify";
import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet;
const SOLANA_NETWORK = WalletAdapterNetwork.Devnet;
const network = SOLANA_NETWORK;

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);

const getProvider = async () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      console.log("Is Phantom installed?  ", provider.isPhantom);
      return provider;
    }
  } else {
    window.open("https://www.phantom.app/", "_blank");
  }
};

const mintingTest = async () => {
  const phantomProvider = await getProvider();
  const mintRequester = await phantomProvider.publicKey;

  //To connect to the mainnet, write mainnet-beta instead of devnet
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  //This fromWallet is your minting wallet, that will actually mint the tokens
  var fromWallet = web3.Keypair.generate();

  // Associate the mintRequester with this wallet's publicKey and privateKey
  // This is basically the credentials that the mintRequester (creator) would require whenever they want to mint some more tokens
  // Testing the parameters of the minting wallet

  console.log(
    "Creator's Minting wallet public key: ",
    fromWallet.publicKey.toString()
  );
  console.log(fromWallet.secretKey.toString());

  // Airdrop 1 SOL to the minting wallet to handle the minting charges
  var fromAirDropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction(fromAirDropSignature);
  console.log(
    "Airdropped (transferred) 1 SOL to the fromWallet to carry out minting operations"
  );

  // This createMint function returns a Promise <Token>
  let mint = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    6, // Number of decimal places in your token
    splToken.TOKEN_PROGRAM_ID
  );

  // getting or creating (if doens't exist) the token address in the fromWallet address
  // fromTokenAccount is essentially the account *inside* the fromWallet that will be able to handle the              new token that we just minted
  let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey
  );

  // getting or creating (if doens't exist) the token address in the toWallet address
  // toWallet is the creator: the og mintRequester
  // toTokenAmount is essentially the account *inside* the mintRequester's (creator's) wallet that will be able to handle the new token that we just minted
  let toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    mintRequester
  );

  // Minting 1 token
  await mint.mintTo(
    fromTokenAccount.address,
    fromWallet.publicKey,
    [],
    1000000 // 1 followed by decimals number of 0s // You'll ask the creator ki how many decimals he wants in his token. If he says 4, then 1 token will be represented as 10000
  );

  console.log("Initial mint successful");

  // This transaction is sending of the creator tokens(tokens you just created) from their minting wallet to their Phantom Wallet
  var transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      1000000 // This is transferring 1 token, not 1000000 tokens
    )
  );
};
export default function SPLToken() {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <Issue />
      </WalletProvider>
    </ConnectionProvider>
  );
}

function Issue() {
  const [values, setValues] = useState({
    name: "",
    symbol: "",
    decimals: 0,
    supply: 0,
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  async function handleIssue(e) {
    e.preventDefault();
    if (active) {
      try {
        await deployERC20(library.getSigner(), { ...values });
      } catch (error) {
        setError(error);
      }
    } else {
      setActivating(true);
      activate(injected);
    }
  }

  return (
    <div className="w-full max-w-xs mx-auto sm:mt-20">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        onClick={mintingTest}
      >
        Minting Test
      </button>
    </div>
  );
}
