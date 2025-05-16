import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DyletsLoanContract...");

  // USDC address on Base mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
  // For testnet, you may need to use a different address or deploy a mock USDC
  const usdcAddress = process.env.NETWORK === "mainnet" 
    ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" 
    : "0xf175520c52418dfe19c8098071a252da48cd1c19"; // Base Goerli USDC

  // Deploy the contract
  const DyletsLoanContract = await ethers.getContractFactory("DyletsLoanContract");
  const dyletsLoan = await DyletsLoanContract.deploy(usdcAddress);

  await dyletsLoan.waitForDeployment();
  
  const contractAddress = await dyletsLoan.getAddress();
  console.log(`DyletsLoanContract deployed to: ${contractAddress}`);
  console.log(`USDC address used: ${usdcAddress}`);

  console.log("Waiting for block confirmations...");
  // Wait for 5 block confirmations
  await dyletsLoan.deploymentTransaction()?.wait(5);

  // Verify the contract on Basescan
  console.log("Verifying contract on Basescan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [usdcAddress],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });