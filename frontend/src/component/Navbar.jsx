import { Link } from 'react-router-dom';
import { Bold, Wallet } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';
import { useEffect, useState } from 'react';

const Navbar = () => {

    const [walletAddress, setWalletAddress] = useState("");
      const [provider, setProvider] = useState(null);
       const [contract, setContract] = useState(null);


             useEffect(() => {
               console.log("Wallet Address:", walletAddress);
               console.log("Provider:", provider);
               console.log("Contract:", contract);
             }, [walletAddress, provider, contract]);
        
             

  return (
    <nav className="bg-indigo-600 text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">BlockResume</Link>
        {/* <button
          onClick={connectWallet}
          className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <Wallet size={20} />
          Connect Wallet
        </button> */}
         <WalletConnect
        setWalletAddress={setWalletAddress}
        setProvider={setProvider}
        setContract={setContract}
      />
      <div className='flex flex-row'>  <p className="text-white font-bold" > Wallet Connected:</p>   {walletAddress && (
        <p className="text-white" style={{ color: "white"}}>
     : {walletAddress}
        </p>
      )}</div>
      {/* Add debug info */}
       
    
      </div>
    </nav>
  );
};

export default Navbar;