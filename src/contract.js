import { ethers } from 'ethers';

// Ethereum Sepolia Multisig Smart Contract
export const CONTRACT_ADDRESS = '0x0757dF7768bEBCdDfC2d97a733eF497A911654b9';

export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';

export const SEPOLIA_RPC_URLS = [
  'https://ethereum-sepolia-rpc.publicnode.com',
  'https://rpc.sepolia.org',
  'https://1rpc.io/sepolia',
];

export const CONTRACT_OWNERS = [
  '0x961a5FFFF40232C50729234956B33d56b6852EEd',
  '0xB853CCF6E2E6e44BF79cd7e80b17bf363325ed75',
  '0x87092f8626E711ceDC323a3007A448Ca4582A342',
];

export const REQUIRED_APPROVALS = 2;

// Core Multisig ABI including functions and events
export const MULTISIG_ABI = [
  // Read / Getter Methods
  'function owners(uint256 index) view returns (address)',
  'function requiredApprovals() view returns (uint256)',
  'function getBalance() view returns (uint256)',
  'function getTransactionCount() view returns (uint256)',
  'function transactions(uint256 _txId) view returns (address to, uint256 value, bool executed)',
  'function getApprovalCount(uint256 _txId) view returns (uint256)',
  'function approved(uint256 _txId, address _owner) view returns (bool)',
  'function isOwner(address account) view returns (bool)',

  // Write / State Changing Methods
  'function submitTransaction(address _to, uint256 _value) external',
  'function approveTransaction(uint256 _txId) external',
  'function executeTransaction(uint256 _txId) external',

  // Fallback / Receive
  'receive() external payable',

  // Events
  'event Deposit(address indexed sender, uint256 amount, uint256 balance)',
  'event SubmitTransaction(address indexed owner, uint256 indexed txIndex, address indexed to, uint256 value)',
  'event ApproveTransaction(address indexed owner, uint256 indexed txIndex)',
  'event ExecuteTransaction(address indexed owner, uint256 indexed txIndex)',
  'event TransactionCreated(address indexed owner, uint256 indexed txId, address indexed to, uint256 value)',
  'event TransactionApproved(address indexed owner, uint256 indexed txId)',
  'event TransactionExecuted(address indexed owner, uint256 indexed txId)'
];

// Helper: Shorten address for UI (e.g. 0x961a...2EEd)
export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Fallback Sepolia Public Provider
export const getSepoliaProvider = () => {
  return new ethers.JsonRpcProvider(SEPOLIA_RPC_URLS[0]);
};

// Read-only or Signer contract instance
export const getMultisigContract = (providerOrSigner) => {
  const provider = providerOrSigner || getSepoliaProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, MULTISIG_ABI, provider);
};

// User-friendly error message parser
export const parseBlockchainError = (error) => {
  if (!error) return 'An unknown error occurred.';
  
  const msg = (error.message || error.toString() || '').toLowerCase();
  const reason = (error.reason || error.info?.error?.message || '').toLowerCase();

  if (error.code === 4001 || msg.includes('user rejected') || msg.includes('action_rejected')) {
    return 'Transaction rejected in MetaMask.';
  }
  if (msg.includes('insufficient funds') || reason.includes('insufficient funds')) {
    return 'Insufficient ETH in your wallet for transaction gas fees.';
  }
  if (msg.includes('not owner') || msg.includes('not an owner') || reason.includes('not owner') || reason.includes('not an owner')) {
    return 'Access Denied: Connected wallet is not one of the 3 authorized contract owners.';
  }
  if (msg.includes('already approved') || reason.includes('already approved')) {
    return 'You have already approved this transaction proposal.';
  }
  if (msg.includes('already executed') || reason.includes('already executed')) {
    return 'This transaction has already been executed.';
  }
  if (msg.includes('approvals') || reason.includes('approvals') || msg.includes('cannot execute')) {
    return 'Cannot execute: Requires at least 2 owner approvals.';
  }
  if (msg.includes('contract balance') || reason.includes('balance')) {
    return 'Multisig contract balance is insufficient to settle this payout.';
  }
  
  return error.reason || (error.message && error.message.length > 120 ? `${error.message.substring(0, 117)}...` : error.message) || 'Contract transaction failed.';
};
