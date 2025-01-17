import { BytesLike, ContractFactory } from "ethers";
import { artifacts, ethers, expect } from "hardhat";
import {
  ALICENET_FACTORY,
  CONTRACT_ADDR,
  DEPLOYED_PROXY,
  DEPLOYED_RAW,
  END_POINT,
  MOCK,
  MOCK_INITIALIZABLE,
  PROXY,
  UTILS,
} from "../../scripts/lib/constants";
import {
  checkMockInit,
  deployCreate2Initable as deployCreate2Initializable,
  deployFactory,
  expectTxSuccess,
  getAccounts,
  getEventVar,
  getMetamorphicAddress,
  getSalt,
} from "./Setup";
describe("AliceNet Contract Factory", () => {
  let firstOwner: string;
  let firstDelegator: string;
  let accounts: Array<string> = [];
  beforeEach(async () => {
    process.env.silencer = "true";
    accounts = await getAccounts();
    firstOwner = accounts[0];
    firstDelegator = accounts[2];
  });

  it("set owner", async () => {
    const factory = await deployFactory();
    // sets the second account as owner
    expect(await factory.owner()).to.equal(firstOwner);
    await factory.setOwner(accounts[1]);
    expect(await factory.owner()).to.equal(accounts[1]);
  });

  it("adds a new external contract to the externalContractRegistry with salt", async () => {
    const factory = await deployFactory();
    const salt = ethers.utils.formatBytes32String("test");
    const mockEndPointBase = await ethers.getContractFactory("MockEndPoint");
    const mockEndPoint = await mockEndPointBase.deploy();
    const lookupBefore = await factory.lookup(salt);
    const txResponse = await factory.addNewExternalContract(
      salt,
      mockEndPoint.address
    );
    await txResponse.wait();
    const lookupAfter = await factory.lookup(salt);
    expect(lookupBefore).to.not.equal(lookupAfter);
    expect(lookupAfter).to.equal(mockEndPoint.address);
  });

  it("onlyOwner should be able add new external contract", async () => {
    const factory = await deployFactory();
    const salt = ethers.utils.formatBytes32String("test");
    const mockEndPointBase = await ethers.getContractFactory("MockEndPoint");
    const mockEndPoint = await mockEndPointBase.deploy();
    const signers = await ethers.getSigners();
    const txResponse = factory
      .connect(signers[1])
      .addNewExternalContract(salt, mockEndPoint.address);
    await expect(txResponse).to.be.revertedWithCustomError(
      factory,
      "Unauthorized"
    );
  });

  it("should not allow changing address of registered salt", async () => {
    const factory = await deployFactory();
    const salt = ethers.utils.formatBytes32String("test");
    const mockEndPointBase = await ethers.getContractFactory("MockEndPoint");
    const mockEndPoint = await mockEndPointBase.deploy();
    let txResponse = factory.addNewExternalContract(salt, mockEndPoint.address);
    await (await txResponse).wait();
    const mockEndPoint2 = await mockEndPointBase.deploy();
    txResponse = factory.addNewExternalContract(salt, mockEndPoint2.address);
    await expect(txResponse).to.be.revertedWithCustomError(
      factory,
      "SaltAlreadyInUse"
    );
  });

  it("get owner", async () => {
    const factory = await deployFactory();
    const owner = await factory.owner();
    expect(owner).to.equal(firstOwner);
  });

  it("deployproxy", async () => {
    const UtilsBase = await ethers.getContractFactory(UTILS);
    const utils = await UtilsBase.deploy();
    const factory = await deployFactory();
    const proxyBase = await artifacts.require(PROXY);
    const proxySalt = getSalt();
    // the calculated proxy address
    const expectedProxyAddr = getMetamorphicAddress(factory.address, proxySalt);
    // deploy the proxy through the factory
    const txResponse = await factory.deployProxy(proxySalt);
    // check if transaction succeeds
    await expectTxSuccess(txResponse);
    // get the deployed proxy contract address fom the DeployedProxy event
    const proxyAddr = await await getEventVar(
      txResponse,
      DEPLOYED_PROXY,
      CONTRACT_ADDR
    );
    // check if the deployed contract address match the calculated address
    expect(proxyAddr).to.equal(expectedProxyAddr);
    // console.log("DEPLOYPROXY GASUSED: ", receipt["receipt"]["gasUsed"]);
    const cSize = await utils.getCodeSize(proxyAddr);
    expect(cSize.toNumber()).to.equal(
      (proxyBase.deployedBytecode.length - 2) / 2
    );
  });

  it("should not allow deploy proxy with unauthorized account", async () => {
    const signers = await ethers.getSigners();
    const factoryBase = (
      await ethers.getContractFactory(ALICENET_FACTORY)
    ).connect(signers[2]);
    let factory = await deployFactory();
    factory = factoryBase.attach(factory.address);
    const Salt = getSalt();

    await expect(
      factory.deployProxy(Salt, { from: firstDelegator })
    ).to.be.revertedWithCustomError(factory, `Unauthorized`);
  });

  it("deploycreate mock logic contract expect success", async () => {
    const factory = await deployFactory();
    // use the ethers Mock contract abstraction to generate the deploy transaction state
    const mockCon: ContractFactory = await ethers.getContractFactory(MOCK);
    // get the init code with constructor args appended
    const deployTx = mockCon.getDeployTransaction(2, "s");
    const transactionCount = await ethers.provider.getTransactionCount(
      factory.address
    );
    // deploy Mock Logic through the factory
    // 27fe1822
    const txResponse = await factory.deployCreate(deployTx.data as BytesLike);
    // check if the transaction is mined or failed
    await expectTxSuccess(txResponse);
    const dcMockAddress = await getEventVar(
      txResponse,
      DEPLOYED_RAW,
      CONTRACT_ADDR
    );
    // calculate the deployed address
    const expectedMockAddr = ethers.utils.getContractAddress({
      from: factory.address,
      nonce: transactionCount,
    });
    expect(dcMockAddress).to.equal(expectedMockAddr);
    // console.log("DEPLOYCREATE MOCK LOGIC GASUSED: ", receipt["receipt"]["gasUsed"]);
  });

  it("should not allow deploycreate mock logic contract with unauthorized account", async () => {
    let factory = await deployFactory();
    // use the ethers Mock contract abstraction to generate the deploy transaction state
    const mockCon = await ethers.getContractFactory(MOCK);
    // get the init code with constructor args appended
    const deployTx = mockCon.getDeployTransaction(2, "s");
    // deploy Mock Logic through the factory
    const signers = await ethers.getSigners();
    const factoryBase = (
      await ethers.getContractFactory(ALICENET_FACTORY)
    ).connect(signers[2]);
    factory = factoryBase.attach(factory.address);
    const txResponse = factory.deployCreate(deployTx.data as BytesLike);

    await expect(txResponse).to.be.revertedWithCustomError(
      factory,
      `Unauthorized`
    );
  });

  it("upgrade proxy to point to mock address with the factory", async () => {
    const factory = await deployFactory();
    const mockFactory = await ethers.getContractFactory(MOCK);
    const proxySalt = getSalt();
    let txResponse = await factory.deployProxy(proxySalt);
    await expectTxSuccess(txResponse);
    const mockContract = await mockFactory.deploy(2, "s");
    txResponse = await factory.upgradeProxy(
      proxySalt,
      mockContract.address,
      "0x"
    );
    await expectTxSuccess(txResponse);
    // console.log("UPGRADE PROXY GASUSED: ", txResponse["receipt"]["gasUsed"]);
  });

  it("should not allow unauthorized account to update proxy to point to other address ", async () => {
    let factory = await deployFactory();
    const mockFactory = await ethers.getContractFactory(MOCK);
    const proxySalt = getSalt();
    let txResponse = await factory.deployProxy(proxySalt);
    await expectTxSuccess(txResponse);
    const mockContract = await mockFactory.deploy(2, "s");
    txResponse = await factory.upgradeProxy(
      proxySalt,
      mockContract.address,
      "0x"
    );
    await expectTxSuccess(txResponse);
    const signers = await ethers.getSigners();
    const factoryBase = (
      await ethers.getContractFactory(ALICENET_FACTORY)
    ).connect(signers[2]);
    factory = factoryBase.attach(factory.address);
    // console.log("UPGRADE PROXY GASUSED: ", txResponse["receipt"]["gasUsed"]);

    await expect(
      factory.upgradeProxy(proxySalt, mockContract.address, "0x", {
        from: firstDelegator,
      })
    ).to.be.revertedWithCustomError(factory, `Unauthorized`);
  });

  it("call setfactory in mock through proxy expect su", async () => {
    const factory = await deployFactory();
    const mockFactory = await ethers.getContractFactory(MOCK);
    const endPointFactory = await ethers.getContractFactory(END_POINT);
    const endPoint = await endPointFactory.deploy();
    const mockContract = await mockFactory.deploy(2, "s");
    const proxySalt = getSalt();
    let txResponse = await factory.deployProxy(proxySalt);
    const proxyAddr = await getEventVar(
      txResponse,
      "DeployedProxy",
      "contractAddr"
    );
    txResponse = await factory.upgradeProxy(
      proxySalt,
      mockContract.address,
      "0x"
    );
    await expectTxSuccess(txResponse);
    // connect a Mock interface to the proxy contract
    const proxyMock = await mockFactory.attach(proxyAddr);
    txResponse = await proxyMock.setFactory(accounts[0]);
    await expectTxSuccess(txResponse);
    const mockFactoryAddress = await proxyMock.callStatic.getFactory();
    expect(mockFactoryAddress).to.equal(accounts[0]);
    // console.log("SETFACTORY GASUSED: ", txResponse["receipt"]["gasUsed"]);
    // lock the proxy
    txResponse = await proxyMock.lock();
    await expectTxSuccess(txResponse);
    // console.log("LOCK UPGRADES GASUSED: ", txResponse["receipt"]["gasUsed"]);
    const txRes = factory.upgradeProxy(proxySalt, endPoint.address, "0x");
    await expect(txRes).to.be.reverted;
    txResponse = await proxyMock.unlock();
    await expectTxSuccess(txResponse);
    txResponse = await factory.upgradeProxy(proxySalt, endPoint.address, "0x");
    await expectTxSuccess(txResponse);
  });

  // fail on bad code
  it("should not allow deploycreate with bad code", async () => {
    const factory = await deployFactory();
    const txResponse = factory.deployCreate("0x6000");

    await expect(txResponse).to.be.revertedWithCustomError(
      factory,
      `CodeSizeZero`
    );
  });

  // fail on unauthorized with bad code
  it("should not allow deploycreate with bad code and unauthorized account", async () => {
    let factory = await deployFactory();
    const signers = await ethers.getSigners();
    const factoryBase = (
      await ethers.getContractFactory(ALICENET_FACTORY)
    ).connect(signers[2]);
    factory = factoryBase.attach(factory.address);
    const txResponse = factory.deployCreate("0x6000");

    await expect(txResponse).to.be.revertedWithCustomError(
      factory,
      `Unauthorized`
    );
  });

  // fail on unauthorized with good code
  it("should not allow deploycreate with valid code and unauthorized account", async () => {
    const factory = await deployFactory();
    const endPointFactory = await ethers.getContractFactory(END_POINT);
    const signers = await ethers.getSigners();
    const factoryBase = (
      await ethers.getContractFactory(ALICENET_FACTORY)
    ).connect(signers[2]);
    const factory2 = factoryBase.attach(factory.address);
    const bytecode = endPointFactory.getDeployTransaction().data as BytesLike;
    const txResponse = factory2.deployCreate(bytecode);

    await expect(txResponse).to.be.revertedWithCustomError(
      factory,
      `Unauthorized`
    );
  });

  it("deploycreate2 mockinitializable", async () => {
    const factory = await deployFactory();
    const salt = getSalt();
    let txResponse = await deployCreate2Initializable(factory, salt);
    await expectTxSuccess(txResponse);
    const mockInitAddr = await await getEventVar(
      txResponse,
      DEPLOYED_RAW,
      CONTRACT_ADDR
    );
    expect(mockInitAddr).to.not.be.equals(undefined);
    const mockInitializable = await ethers.getContractFactory(
      MOCK_INITIALIZABLE
    );
    const initCallData = mockInitializable.interface.encodeFunctionData(
      "initialize",
      [2]
    );
    txResponse = await factory.initializeContract(mockInitAddr, initCallData);
    await expectTxSuccess(txResponse);
    await checkMockInit(mockInitAddr, 2);
  });

  it("callany", async () => {
    const factory = await deployFactory();
    const salt = getSalt();
    let txResponse = await deployCreate2Initializable(factory, salt);
    await expectTxSuccess(txResponse);
    const mockInitAddr = await getEventVar(
      txResponse,
      DEPLOYED_RAW,
      CONTRACT_ADDR
    );
    expect(mockInitAddr).to.not.be.equals(undefined);
    // call state to initialize mockInitializable
    const mockInitable = await ethers.getContractFactory(MOCK_INITIALIZABLE);
    const initCallData = mockInitable.interface.encodeFunctionData(
      "initialize",
      [2]
    );
    txResponse = await factory.callAny(mockInitAddr, 0, initCallData);
    await checkMockInit(mockInitAddr, 2);
  });

  it("delegatecallany", async () => {
    const factory = await deployFactory();
    expect(await factory.owner()).to.equal(firstOwner);
    // deploy an instance of mock logic for factory
    const mockFactoryBase = await ethers.getContractFactory("MockFactory");
    const mockFactoryInstance = await mockFactoryBase.deploy();
    // generate the call state for the factory instance
    const mfEncode = await ethers.getContractFactory("MockFactory");
    let setOwner = mfEncode.interface.encodeFunctionData("setOwner", [
      accounts[2],
    ]);
    // delegate call into the factory and change the owner
    let txResponse = await factory.delegateCallAny(
      mockFactoryInstance.address,
      setOwner
    );
    await expectTxSuccess(txResponse);
    let owner = await factory.owner();
    expect(owner).to.equal(accounts[2]);
    setOwner = await mfEncode.interface.encodeFunctionData("setOwner", [
      accounts[0],
    ]);
    const signers = await ethers.getSigners();
    const factoryBase = (
      await ethers.getContractFactory(ALICENET_FACTORY)
    ).connect(signers[2]);
    const factory2 = factoryBase.attach(factory.address);
    txResponse = await factory2.delegateCallAny(
      mockFactoryInstance.address,
      setOwner
    );
    await expectTxSuccess(txResponse);
    owner = await factory.owner();
    expect(owner).to.equal(accounts[0]);
  });

  it("deploys a mock contract, calls payMe from factory with delegateCallAny", async () => {
    const factory = await deployFactory();
    const mockFactory = await ethers.getContractFactory(MOCK);
    const mock = await mockFactory.deploy(2, "s");
    const callData = mockFactory.interface.encodeFunctionData("payMe");
    await factory.delegateCallAny(mock.address, callData, {
      value: 2,
    });
    expect(await ethers.provider.getBalance(factory.address)).to.equal(2);
  });

  it("upgrade proxy through factory", async () => {
    const factory = await deployFactory();
    const endPointLockableFactory = await ethers.getContractFactory(
      "MockEndPointLockable"
    );
    const endPointLockable = await endPointLockableFactory.deploy(
      factory.address
    );
    const salt = getSalt();
    const expectedProxyAddr = getMetamorphicAddress(factory.address, salt);
    let txResponse = await factory.deployProxy(salt);
    await expectTxSuccess(txResponse);
    const proxyAddr = await getEventVar(
      txResponse,
      DEPLOYED_PROXY,
      CONTRACT_ADDR
    );
    expect(proxyAddr).to.equal(expectedProxyAddr);
    txResponse = await factory.upgradeProxy(
      salt,
      endPointLockable.address,
      "0x"
    );
    await expectTxSuccess(txResponse);
    const proxyFactory = await ethers.getContractFactory("Proxy");
    const proxyContract = proxyFactory.attach(proxyAddr);
    const proxyImplAddress =
      await proxyContract.callStatic.getImplementationAddress();
    expect(proxyImplAddress).to.equal(endPointLockable.address);
  });

  it("lock proxy upgrade from factory", async () => {
    const factory = await deployFactory();
    const endPointLockableFactory = await ethers.getContractFactory(
      "MockEndPointLockable"
    );
    const endPointLockable = await endPointLockableFactory.deploy(
      factory.address
    );
    const salt = getSalt();
    const expectedProxyAddr = getMetamorphicAddress(factory.address, salt);
    let txResponse = await factory.deployProxy(salt);
    await expectTxSuccess(txResponse);
    const proxyAddr = await getEventVar(
      txResponse,
      DEPLOYED_PROXY,
      CONTRACT_ADDR
    );
    expect(proxyAddr).to.equal(expectedProxyAddr);
    txResponse = await factory.upgradeProxy(
      salt,
      endPointLockable.address,
      "0x"
    );
    await expectTxSuccess(txResponse);
    const proxyFactory = await ethers.getContractFactory("Proxy");
    const proxyContract = proxyFactory.attach(proxyAddr);
    const proxyImplAddress =
      await proxyContract.callStatic.getImplementationAddress();
    expect(proxyImplAddress).to.equal(endPointLockable.address);
  });

  it("should prevent locked proxy logic from being upgraded from factory", async () => {
    const factory = await deployFactory();
    const endPointFactory = await ethers.getContractFactory(END_POINT);
    const endPoint = await endPointFactory.deploy();
    const endPointLockableFactory = await ethers.getContractFactory(
      "MockEndPointLockable"
    );
    const endPointLockable = await endPointLockableFactory.deploy(
      factory.address
    );
    const salt = getSalt();
    const expectedProxyAddr = getMetamorphicAddress(factory.address, salt);
    let txResponse = await factory.deployProxy(salt);
    await expectTxSuccess(txResponse);
    const proxyAddr = await getEventVar(
      txResponse,
      DEPLOYED_PROXY,
      CONTRACT_ADDR
    );
    expect(proxyAddr).to.equal(expectedProxyAddr);
    txResponse = await factory.upgradeProxy(
      salt,
      endPointLockable.address,
      "0x"
    );
    await expectTxSuccess(txResponse);
    const proxyFactory = await ethers.getContractFactory("Proxy");
    const proxy = proxyFactory.attach(proxyAddr);
    const proxyImplAddress = await proxy.callStatic.getImplementationAddress();
    expect(proxyImplAddress).to.equal(endPointLockable.address);
    const proxyContract = endPointLockableFactory.attach(proxy.address);
    const lockResponse = await proxyContract.upgradeLock();
    const receipt = await lockResponse.wait();
    expect(receipt.status).to.equal(1);
    await expect(factory.upgradeProxy(salt, endPoint.address, "0x")).to.be
      .reverted;
  });

  it("deploys a mock contract, calls payMe from factory with callAny", async () => {
    const factory = await deployFactory();
    const mockFactory = await ethers.getContractFactory(MOCK);
    const mock = await mockFactory.deploy(2, "s");
    const callData = mockFactory.interface.encodeFunctionData("payMe");
    await factory.callAny(mock.address, 2, callData, {
      value: 2,
    });
  });
});
