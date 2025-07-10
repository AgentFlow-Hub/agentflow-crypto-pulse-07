
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToBNBTestnet: () => Promise<void>;
  createToken: (tokenData: { name: string; symbol: string; description: string }) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const BNB_TESTNET_CONFIG = {
  chainId: '0x61', // 97 in decimal
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setIsConnected(true);
          setProvider(provider);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to connect your wallet');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setIsConnected(true);
      setProvider(provider);
      
      // Automatically switch to BNB testnet after connecting
      await switchToBNBTestnet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setProvider(null);
  };

  const switchToBNBTestnet = async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BNB_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // Chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BNB_TESTNET_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding BNB testnet:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to BNB testnet:', switchError);
        throw switchError;
      }
    }
  };

  const createToken = async (tokenData: { name: string; symbol: string; description: string }) => {
    if (!provider || !account) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const signer = await provider.getSigner();
      
      // Simple token creation transaction (this would typically deploy a contract)
      // For demo purposes, we'll simulate a transaction
      const tx = await signer.sendTransaction({
        to: account, // Self-transaction for demo
        value: ethers.parseEther('0.001'), // Small amount for gas demonstration
        data: '0x' // Empty data for demo
      });

      console.log('Token creation transaction:', tx.hash);
      alert(`Token "${tokenData.name}" creation initiated! Transaction: ${tx.hash}`);
      
      await tx.wait();
      alert(`Token "${tokenData.name}" created successfully!`);
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Failed to create token. Please try again.');
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        isConnecting,
        provider,
        connectWallet,
        disconnectWallet,
        switchToBNBTestnet,
        createToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
