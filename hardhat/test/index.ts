import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("IndexDeployer", function () {
  let IndexDeployer;
  let indexDeployer: any;
  let protocolAddress: SignerWithAddress;
  let managerAddress: SignerWithAddress;
  let investorAddress: SignerWithAddress;
  let indexAddress: string;

  beforeEach(async function () {
    [protocolAddress, managerAddress, investorAddress] =
      await ethers.getSigners();
    IndexDeployer = await ethers.getContractFactory("IndexDeployer");
    indexDeployer = await upgrades.deployProxy(
      IndexDeployer,
      [protocolAddress.address],
      { initializer: "initialize" }
    );
  });
  describe("Deployment", function () {
    it("should set the right owner (protocolAddress)", async function () {
      expect(await indexDeployer.protocolAddress()).to.equal(
        protocolAddress.address
      );
    });
    it("should set the proper version of the contract", async function () {
      expect(await indexDeployer.indexContractVersion()).to.equal(1);
    });
    it("should be upgradeable", async function () {
      const IndexDeployerV2 = await ethers.getContractFactory(
        "IndexDeployerV2"
      );
      indexDeployer = await upgrades.upgradeProxy(
        indexDeployer.address,
        IndexDeployerV2
      );
      await indexDeployer.setNewContractVersion();
      expect(await indexDeployer.indexContractVersion()).to.equal(2);
    });
    it("should set WETH as the native currency", async function () {
      expect(await indexDeployer.nativeCurrency()).to.equal(
        ethers.constants.AddressZero
      );
      await indexDeployer.setNativeCurrency(WETH);
      expect(await indexDeployer.nativeCurrency()).to.equal(WETH);
    });
    it("should deploy an Index", async function () {
      await indexDeployer.setNativeCurrency(WETH);
      const tx = await indexDeployer
        .connect(managerAddress)
        .createIndex(
          "A fund for the development of the Ethereum protocol",
          "$FETH",
          [DAI, USDC],
          [5000, 5000],
          [3000, 3000],
          100
        );
      const rc = await tx.wait();
      const event = rc.events.find(
        (event: any) => event.event === "LogDeployedIndexContract"
      );
      indexAddress = event.args[0];
      const Index = await ethers.getContractFactory("Index");
      const index = await Index.attach(indexAddress);

      expect(await index.symbol()).to.equal("$FETH");
      expect(await index.name()).to.equal(
        "A fund for the development of the Ethereum protocol"
      );
      expect(await index.managerAddress()).to.equal(managerAddress.address);
      expect(await index.managerFee()).to.equal(100);
      expect(await index.protocolFee()).to.equal(100);
      expect(await index.protocolAddress()).to.equal(protocolAddress.address);
      expect(await index.networkCurrency()).to.equal(WETH);
      expect(await index.managerBalance()).to.equal(0);
      expect(await indexDeployer.getIndexesLength()).to.equal(1);
    });
    it("should deploy an Index STANDALONE (without using IndexDeployer)", async function () {
      const Index = await ethers.getContractFactory("Index");
      const index = await Index.deploy(
        "Standalone Index",
        "$STANDALONE",
        [DAI, USDC],
        [5000, 5000],
        [3000, 3000],
        100,
        WETH,
        100,
        protocolAddress.address,
        managerAddress.address
      );

      expect(await index.symbol()).to.equal("$STANDALONE");
      expect(await index.name()).to.equal("Standalone Index");
      expect(await index.managerAddress()).to.equal(managerAddress.address);
      expect(await index.managerFee()).to.equal(100);
      expect(await index.protocolFee()).to.equal(100);
      expect(await index.protocolAddress()).to.equal(protocolAddress.address);
      expect(await index.networkCurrency()).to.equal(WETH);
      expect(await index.managerBalance()).to.equal(0);

      await index
        .connect(investorAddress)
        .buy({ value: ethers.utils.parseEther("100") });

      expect(await index.managerBalance()).to.equal(
        ethers.utils.parseEther("1") //fee 1%
      );

      expect(await index.balanceOf(investorAddress.address)).to.equal(
        ethers.utils
          .parseEther("100")
          .sub(ethers.utils.parseEther("1")) //managementFee 1%
          .sub(ethers.utils.parseEther("1")) //protocolFee 1%
      );
    });
    it("should redeem the index", async function () {
      await indexDeployer.setNativeCurrency(WETH);
      const tx = await indexDeployer
        .connect(managerAddress)
        .createIndex(
          "A fund for the development of the Ethereum protocol",
          "$FETH",
          [DAI, USDC],
          [5000, 5000],
          [3000, 3000],
          100
        );
      const rc = await tx.wait();
      const event = rc.events.find(
        (event: any) => event.event === "LogDeployedIndexContract"
      );
      indexAddress = event.args[0];
      const Index = await ethers.getContractFactory("Index");
      const index = await Index.attach(indexAddress);

      const buyTx = await index
        .connect(investorAddress)
        .buy({ value: ethers.utils.parseEther("100") });

      const redeemTx = await index.connect(investorAddress).redeem();

      expect(await index.balanceOf(investorAddress.address)).to.equal(0);

      // get all events
      // const buyRecepit = await buyTx.wait();
      // const buyEvents = buyRecepit.events.map((event: any) => ({
      //   event: event.event,
      //   args: JSON.stringify(event.args),
      // }));

      // const redeemRecepit = await redeemTx.wait();
      // const redeemEvents = redeemRecepit.events.map((event: any) => ({
      //   event: event.event,
      //   args: JSON.stringify(event.args),
      // }));
    });
  });
});
