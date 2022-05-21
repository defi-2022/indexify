import { ethers, upgrades } from "hardhat";

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

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
  await indexDeployer.setNativeCurrency(WETH);

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
