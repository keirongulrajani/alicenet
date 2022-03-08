import { expect } from "chai";
import { config, ethers, run } from "hardhat";
import { MOCK } from "../../scripts/lib/constants";
import { getDefaultFactoryAddress } from "../../scripts/lib/factoryStateUtil";
import { getAccounts, predictFactoryAddress } from "./Setup";

describe("Cli tasks", async () => {
  let firstOwner: string;
  let firstDelegator: string;
  let accounts: Array<string> = [];

  beforeEach(async () => {
    accounts = await getAccounts();
    process.env.silencer = "true";
    //set owner and delegator
    firstOwner = accounts[0];
    firstDelegator = accounts[1];
  });

  xit("deploy factory with cli", async () => {
    let futureFactoryAddress = await predictFactoryAddress(firstOwner);
    let factoryAddress = await run("deployFactory");
    //check if the address is the predicted
    expect(factoryAddress).to.equal(futureFactoryAddress);
    let network = ethers.provider.network.name
    let defaultFactoryAddress = await getDefaultFactoryAddress(network);
    expect(defaultFactoryAddress).to.equal(factoryAddress);
  });

  xit("deploy mock with deploystatic", async () => {
    await run("deployMetamorphic", {
      contractName: MOCK,
      constructorArgs: ["2", "s"],
    });
  });
});
