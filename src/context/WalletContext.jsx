import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESS,
  CONTRACT_OWNERS,
  REQUIRED_APPROVALS,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_CHAIN_ID_HEX,
  getSepoliaProvider,
  getMultisigContract,
  parseBlockchainError,
  shortenAddress,
} from '../contract';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // Blockchain Data States
  const [balance, setBalance] = useState('0.00');
  const [rawBalance, setRawBalance] = useState(0n);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [activityEvents, setActivityEvents] = useState([]);
  const [requiredThreshold, setRequiredThreshold] = useState(REQUIRED_APPROVALS);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [contractReadError, setContractReadError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [txPendingConfirmation, setTxPendingConfirmation] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, txHash = null) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message, txHash }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check MetaMask installation on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && Boolean(window.ethereum)) {
      setHasMetaMask(true);
    } else {
      setHasMetaMask(false);
    }
  }, []);

  const isConnected = Boolean(account);
  const isSepolia = chainId === SEPOLIA_CHAIN_ID;

  // Determine Owner Status: Owner 1, Owner 2, Owner 3, or Not an Owner
  const normalizedAccount = account ? account.toLowerCase() : null;
  const ownerIndex = normalizedAccount
    ? CONTRACT_OWNERS.findIndex((owner) => owner.toLowerCase() === normalizedAccount)
    : -1;

  const isOwner = ownerIndex !== -1;
  const ownerLabel = isOwner ? `Owner ${ownerIndex + 1}` : 'Not an owner';
  const ownerNumber = isOwner ? ownerIndex + 1 : null;

  // Connect MetaMask Wallet
  const connectWallet = useCallback(async () => {
    setErrorMessage('');
    if (typeof window === 'undefined' || !window.ethereum) {
      setErrorMessage('MetaMask is not installed. Please install MetaMask to connect.');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setChainId(Number(network.chainId));
        addToast('success', `Connected: ${shortenAddress(accounts[0])}`);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      const msg = parseBlockchainError(error);
      setErrorMessage(msg);
      addToast('error', msg);
    } finally {
      setIsConnecting(false);
    }
  }, [addToast]);

  // Switch network to Sepolia
  const switchToSepolia = useCallback(async () => {
    setErrorMessage('');
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
      setChainId(SEPOLIA_CHAIN_ID);
      addToast('success', 'Switched to Sepolia Testnet');
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID_HEX,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.org', 'https://ethereum-sepolia-rpc.publicnode.com'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          setChainId(SEPOLIA_CHAIN_ID);
          addToast('success', 'Sepolia Testnet added & connected');
        } catch (addError) {
          setErrorMessage('Failed to add Sepolia testnet to MetaMask.');
        }
      } else if (switchError.code === 4001) {
        setErrorMessage('Network switch request was rejected in MetaMask.');
      } else {
        setErrorMessage(switchError.message || 'Failed to switch network to Sepolia.');
      }
    }
  }, [addToast]);

  // Disconnect / Reset state
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setErrorMessage('');
    addToast('info', 'Wallet disconnected');
  }, [addToast]);

  // Real Blockchain Data Fetcher
  const fetchBlockchainData = useCallback(async () => {
    setIsLoadingData(true);
    setContractReadError(null);

    try {
      let activeProvider;
      if (hasMetaMask && window.ethereum && chainId === SEPOLIA_CHAIN_ID) {
        activeProvider = new ethers.BrowserProvider(window.ethereum);
      } else {
        activeProvider = getSepoliaProvider();
      }

      const contract = getMultisigContract(activeProvider);

      // 1. Read Required Approvals
      let reqApprovals = REQUIRED_APPROVALS;
      try {
        const req = await contract.requiredApprovals();
        reqApprovals = Number(req);
        setRequiredThreshold(reqApprovals);
      } catch (e) {
        console.warn('Using fallback requiredApprovals:', e);
      }

      // 2. Read Balance using getBalance() with provider fallback
      let balWei = 0n;
      try {
        balWei = await contract.getBalance();
      } catch (err) {
        try {
          balWei = await activeProvider.getBalance(CONTRACT_ADDRESS);
        } catch (e) {
          console.error('Balance read error:', e);
        }
      }

      setRawBalance(balWei);
      try {
        const formatted = ethers.formatEther(balWei);
        const num = parseFloat(formatted);
        if (num === 0) {
          setBalance('0.00');
        } else if (num < 0.0001) {
          setBalance(formatted);
        } else {
          setBalance(num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }));
        }
      } catch (err) {
        setBalance('0.00');
      }

      // 3. Read Transaction Count
      let countBigInt = 0n;
      try {
        countBigInt = await contract.getTransactionCount();
      } catch (err) {
        console.warn('getTransactionCount failed:', err);
      }

      const totalCount = Number(countBigInt);
      setTransactionCount(totalCount);

      // 4. Fetch Each Real Transaction
      const fetchedTxs = [];
      const userAddr = account ? account.toLowerCase() : null;

      for (let i = 0; i < totalCount; i++) {
        try {
          const txData = await contract.transactions(i);
          let appCount = 0n;
          try {
            appCount = await contract.getApprovalCount(i);
          } catch (e) {
            appCount = 0n;
          }

          // Check approval status for all 3 owners
          const ownerApprovals = await Promise.all(
            CONTRACT_OWNERS.map(async (ownerAddress) => {
              try {
                return await contract.approved(i, ownerAddress);
              } catch (e) {
                return false;
              }
            })
          );

          let userHasApproved = false;
          if (userAddr) {
            try {
              userHasApproved = await contract.approved(i, userAddr);
            } catch (e) {
              userHasApproved = false;
            }
          }

          const to = txData.to || txData[0];
          const val = txData.value !== undefined ? txData.value : txData[1];
          const executed = Boolean(txData.executed !== undefined ? txData.executed : txData[2]);
          const approvalCountNum = Number(appCount);

          let status = 'Pending';
          if (executed) {
            status = 'Executed';
          } else if (approvalCountNum >= reqApprovals) {
            status = 'Ready to Execute';
          }

          fetchedTxs.push({
            id: i,
            to,
            value: val,
            valueEth: ethers.formatEther(val || 0n),
            executed,
            approvalCount: approvalCountNum,
            requiredApprovals: reqApprovals,
            ownerApprovals, // [bool, bool, bool] for Owner 1, Owner 2, Owner 3
            userApproved: userHasApproved,
            status,
          });
        } catch (txErr) {
          console.error(`Error reading tx #${i}:`, txErr);
        }
      }

      const sortedTxs = [...fetchedTxs].reverse();
      setTransactions(sortedTxs);

      // 5. Query Real Event Logs for Blockchain Activity Center
      const eventsList = [];
      try {
        // Query recent Deposit and transaction events
        const depositFilter = contract.filters.Deposit ? contract.filters.Deposit() : null;
        if (depositFilter) {
          const depositLogs = await contract.queryFilter(depositFilter, -10000);
          depositLogs.forEach((log) => {
            eventsList.push({
              id: `dep-${log.transactionHash}-${log.index}`,
              type: 'Deposit',
              title: 'Deposit detected',
              description: `${ethers.formatEther(log.args?.amount || log.args?.[1] || 0n)} ETH received by multisig vault`,
              address: log.args?.sender || log.args?.[0],
              amount: ethers.formatEther(log.args?.amount || log.args?.[1] || 0n),
              txHash: log.transactionHash,
              blockNumber: log.blockNumber,
              iconType: 'deposit',
            });
          });
        }
      } catch (logErr) {
        console.warn('Could not query raw logs:', logErr);
      }

      // Reconstruct activity from real transaction states if logs are limited
      fetchedTxs.forEach((tx) => {
        // Transaction Created activity
        eventsList.push({
          id: `tx-create-${tx.id}`,
          type: 'Created',
          title: `Transaction #${tx.id} created`,
          description: `Proposal for ${tx.valueEth} ETH → ${shortenAddress(tx.to)}`,
          address: tx.to,
          amount: tx.valueEth,
          txId: tx.id,
          iconType: 'create',
        });

        // Owner Approvals activity
        tx.ownerApprovals.forEach((approved, oIdx) => {
          if (approved) {
            eventsList.push({
              id: `tx-app-${tx.id}-${oIdx}`,
              type: 'Approved',
              title: `Transaction #${tx.id} approved`,
              description: `Approved by Owner 0${oIdx + 1} (${shortenAddress(CONTRACT_OWNERS[oIdx])})`,
              address: CONTRACT_OWNERS[oIdx],
              txId: tx.id,
              iconType: 'approve',
            });
          }
        });

        // Transaction Executed activity
        if (tx.executed) {
          eventsList.push({
            id: `tx-exec-${tx.id}`,
            type: 'Executed',
            title: `Transaction #${tx.id} executed`,
            description: `Payout of ${tx.valueEth} ETH transferred on Sepolia`,
            address: tx.to,
            amount: tx.valueEth,
            txId: tx.id,
            iconType: 'execute',
          });
        }
      });

      // Show balance deposit activity item if balance > 0 and no deposit log was retrieved
      if (balWei > 0n && !eventsList.some((e) => e.type === 'Deposit')) {
        eventsList.unshift({
          id: 'initial-balance-detected',
          type: 'Deposit',
          title: 'Deposit detected',
          description: `${ethers.formatEther(balWei)} ETH available in multisig contract vault`,
          address: CONTRACT_ADDRESS,
          amount: ethers.formatEther(balWei),
          iconType: 'deposit',
        });
      }

      setActivityEvents(eventsList.reverse());
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error in fetchBlockchainData:', err);
      setContractReadError('Could not connect to Sepolia contract. Retrying with fallback RPC...');
    } finally {
      setIsLoadingData(false);
    }
  }, [hasMetaMask, chainId, account]);

  // Submit Transaction (Write operation)
  const submitTransaction = async (recipientAddress, amountEth) => {
    if (!hasMetaMask || !account) {
      addToast('error', 'Please connect your MetaMask wallet first.');
      throw new Error('Wallet not connected');
    }
    if (!isOwner) {
      addToast('error', 'Access Denied: Only authorized multisig owners can submit proposals.');
      throw new Error('Not an owner');
    }
    if (!isSepolia) {
      addToast('warning', 'Please switch your wallet to Sepolia Testnet first.');
      await switchToSepolia();
      throw new Error('Wrong network');
    }
    if (!ethers.isAddress(recipientAddress)) {
      addToast('error', 'Invalid recipient Ethereum address.');
      throw new Error('Invalid address');
    }

    setTxPendingConfirmation(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = getMultisigContract(signer);

      const amountWei = ethers.parseEther(amountEth.toString());
      addToast('info', 'Submitting proposal to MetaMask...');

      // Note: submitTransaction is NOT payable
      const tx = await contractWithSigner.submitTransaction(recipientAddress, amountWei);
      addToast('info', `Transaction broadcasted! Mining on Sepolia...`, tx.hash);

      const receipt = await tx.wait();
      addToast('success', 'Transaction proposal created on Sepolia!', receipt.hash);
      await fetchBlockchainData();
      return receipt;
    } catch (err) {
      console.error('Error in submitTransaction:', err);
      const friendlyErr = parseBlockchainError(err);
      addToast('error', friendlyErr);
      throw new Error(friendlyErr);
    } finally {
      setTxPendingConfirmation(false);
    }
  };

  // Approve Transaction (Write operation)
  const approveTransaction = async (txId) => {
    if (!hasMetaMask || !account) {
      addToast('error', 'Please connect your MetaMask wallet first.');
      throw new Error('Wallet not connected');
    }
    if (!isOwner) {
      addToast('error', 'Access Denied: Only authorized multisig owners can approve.');
      throw new Error('Not an owner');
    }
    if (!isSepolia) {
      addToast('warning', 'Please switch your wallet to Sepolia Testnet.');
      await switchToSepolia();
      throw new Error('Wrong network');
    }

    setTxPendingConfirmation(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = getMultisigContract(signer);

      addToast('info', `Approving Transaction #${txId} in MetaMask...`);
      const tx = await contractWithSigner.approveTransaction(txId);
      addToast('info', `Approval submitted. Waiting for confirmation...`, tx.hash);

      const receipt = await tx.wait();
      addToast('success', `Transaction #${txId} approved successfully!`, receipt.hash);
      await fetchBlockchainData();
      return receipt;
    } catch (err) {
      console.error('Error in approveTransaction:', err);
      const friendlyErr = parseBlockchainError(err);
      addToast('error', friendlyErr);
      throw new Error(friendlyErr);
    } finally {
      setTxPendingConfirmation(false);
    }
  };

  // Execute Transaction (Write operation)
  const executeTransaction = async (txId) => {
    if (!hasMetaMask || !account) {
      addToast('error', 'Please connect your MetaMask wallet first.');
      throw new Error('Wallet not connected');
    }
    if (!isOwner) {
      addToast('error', 'Access Denied: Only authorized multisig owners can execute.');
      throw new Error('Not an owner');
    }
    if (!isSepolia) {
      addToast('warning', 'Please switch your wallet to Sepolia Testnet.');
      await switchToSepolia();
      throw new Error('Wrong network');
    }

    setTxPendingConfirmation(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = getMultisigContract(signer);

      addToast('info', `Executing Transaction #${txId} in MetaMask...`);
      const tx = await contractWithSigner.executeTransaction(txId);
      addToast('info', `Execution broadcasted to Sepolia! Waiting for block...`, tx.hash);

      const receipt = await tx.wait();
      addToast('success', `🎉 Transaction #${txId} executed & payout settled!`, receipt.hash);
      await fetchBlockchainData();
      return receipt;
    } catch (err) {
      console.error('Error in executeTransaction:', err);
      const friendlyErr = parseBlockchainError(err);
      addToast('error', friendlyErr);
      throw new Error(friendlyErr);
    } finally {
      setTxPendingConfirmation(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBlockchainData();
  }, [fetchBlockchainData]);

  // Listen to accountsChanged and chainChanged events from MetaMask
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          window.ethereum
            .request({ method: 'eth_chainId' })
            .then((cId) => setChainId(parseInt(cId, 16)))
            .catch(console.error);
        }
      })
      .catch(console.error);

    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
      fetchBlockchainData();
    };

    const handleChainChanged = (cId) => {
      setChainId(parseInt(cId, 16));
      fetchBlockchainData();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [fetchBlockchainData]);

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        isConnected,
        isSepolia,
        isOwner,
        ownerLabel,
        ownerNumber,
        isConnecting,
        errorMessage,
        hasMetaMask,
        connectWallet,
        disconnectWallet,
        switchToSepolia,
        setErrorMessage,
        contractAddress: CONTRACT_ADDRESS,
        owners: CONTRACT_OWNERS,
        requiredApprovals: requiredThreshold,
        balance,
        rawBalance,
        transactionCount,
        transactions,
        pendingTransactions: transactions.filter((t) => !t.executed),
        executedTransactions: transactions.filter((t) => t.executed),
        activityEvents,
        isLoadingData,
        contractReadError,
        lastRefreshed,
        txPendingConfirmation,
        refreshBlockchainData: fetchBlockchainData,
        submitTransaction,
        approveTransaction,
        executeTransaction,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
