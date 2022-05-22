import { ethers, upgrades } from "hardhat";

const MATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";

async function main() {
  // in this case, the deployer becomes the protocol address
  const [protocolAddress] = await ethers.getSigners();

  const IndexDeployer = await ethers.getContractFactory("IndexDeployer");
  const indexDeployer = await upgrades.deployProxy(
    IndexDeployer,
    [protocolAddress.address],
    { initializer: "initialize" }
  );

  await indexDeployer.deployed();
  await indexDeployer.setNativeCurrency(MATIC);

  console.log("IndexDeployer deployed to:", indexDeployer.address);

  // Upgrade process:
  // const IndexDeployerV2 = await ethers.getContractFactory('IndexDeployerV2');
  // await upgrades.upgradeProxy(indexDeployer.address, IndexDeployerV2);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
