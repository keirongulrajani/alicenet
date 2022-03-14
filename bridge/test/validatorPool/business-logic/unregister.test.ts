import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { expect } from "../../chai-setup";
import { completeETHDKGRound } from "../../ethdkg/setup";
import {
  factoryCallAny,
  Fixture,
  getFixture,
  getValidatorEthAccount,
} from "../../setup";
import { validatorsSnapshots } from "../../snapshots/assets/4-validators-snapshots-1";
import {
  burnStakeTo,
  createValidators,
  getCurrentState,
  stakeValidators,
} from "../setup";

describe("ValidatorPool: Unregistration logic", async () => {
  let fixture: Fixture;
  let stakeAmount: bigint;
  let validators: Array<string>;
  let stakingTokenIds: Array<BigNumber>;
  let adminSigner: Signer;

  beforeEach(async function () {
    fixture = await getFixture(false, true, true);
    stakeAmount = (await fixture.validatorPool.getStakeAmount()).toBigInt();
    validators = await createValidators(fixture, validatorsSnapshots);
    stakingTokenIds = await stakeValidators(fixture, validators);
    const [admin, , ,] = fixture.namedSigners;
    adminSigner = await getValidatorEthAccount(admin.address);
  });

  it("Should not allow unregistering of non-validators (even in the middle of array of validators)", async function () {
    await factoryCallAny(fixture, "validatorPool", "registerValidators", [
      validators,
      stakingTokenIds,
    ]);
    let newValidators = validators;
    //Set a non validator address in the middle of array for un-registering
    newValidators[1] = "0x000000000000000000000000000000000000dEaD";
    await expect(
      factoryCallAny(fixture, "validatorPool", "unregisterValidators", [
        newValidators,
      ])
    ).to.be.revertedWith("ValidatorPool: Address is not a validator_!");
  });

  it("Should not allow unregistering if consensus or an ETHDKG round is running", async function () {
    await factoryCallAny(fixture, "validatorPool", "registerValidators", [
      validators,
      stakingTokenIds,
    ]);
    // Complete ETHDKG Round
    await factoryCallAny(fixture, "validatorPool", "initializeETHDKG");
    await expect(
      factoryCallAny(fixture, "validatorPool", "unregisterValidators", [
        validators,
      ])
    ).to.be.revertedWith("ValidatorPool: There's an ETHDKG round running!");
    await completeETHDKGRound(validatorsSnapshots, {
      ethdkg: fixture.ethdkg,
      validatorPool: fixture.validatorPool,
    });
    await expect(
      factoryCallAny(fixture, "validatorPool", "unregisterValidators", [
        validators,
      ])
    ).to.be.revertedWith(
      "ValidatorPool: Error Madnet Consensus should be halted!"
    );
  });

  it("Should not allow unregistering more addresses that in the pool", async function () {
    await factoryCallAny(fixture, "validatorPool", "registerValidators", [
      validators,
      stakingTokenIds,
    ]);
    //Add an extra validator to unregister array
    validators.push("0x000000000000000000000000000000000000dEaD");
    stakingTokenIds.push(BigNumber.from(0));
    await expect(
      factoryCallAny(fixture, "validatorPool", "unregisterValidators", [
        validators,
      ])
    ).to.be.revertedWith(
      "ValidatorPool: There are not enough validators to be removed!"
    );
  });

  it("Should not allow registering an address that was unregistered and didn’t claim is stakeNFT position", async function () {
    await factoryCallAny(fixture, "validatorPool", "registerValidators", [
      validators,
      stakingTokenIds,
    ]);
    await factoryCallAny(fixture, "validatorPool", "unregisterValidators", [
      validators,
    ]);
    let newValidators = await createValidators(fixture, validatorsSnapshots);
    let newStakeNFTIds = await stakeValidators(fixture, newValidators);
    await expect(
      factoryCallAny(fixture, "validatorPool", "registerValidators", [
        validators,
        newStakeNFTIds,
      ])
    ).to.be.revertedWith(
      "ValidatorPool: Address is already a validator or it is in the exiting line!"
    );
  });

  it("Should successfully unregister validators if all conditions are met", async function () {
    let expectedState = await getCurrentState(fixture, validators);
    //Expect that NFT are transferred from ValidatorPool to Factory
    for (let index = 0; index < validators.length; index++) {
      expectedState.ValidatorPool.StakeNFT++;
      expectedState.Factory.StakeNFT--;
      expectedState.validators[index].Acc = true;
      expectedState.validators[index].ExQ = true;
    }
    await factoryCallAny(fixture, "validatorPool", "registerValidators", [
      validators,
      stakingTokenIds,
    ]);
    await factoryCallAny(fixture, "validatorPool", "unregisterValidators", [
      validators,
    ]);
    let currentState = await getCurrentState(fixture, validators);
    expect(currentState).to.be.deep.equal(expectedState);
  });

  it("Should successfully unregister validators if all conditions are met and there are excess of Eth and Tokens", async function () {
    // Mint a stakeNFT and burn it to the ValidatorPool contract. Besides a contract self destructing
    // itself, this is a method to send eth accidentally to the validatorPool contract
    let etherAmount = ethers.utils.parseEther("1");
    let madTokenAmount = ethers.utils.parseEther("2");
    await burnStakeTo(fixture, etherAmount, madTokenAmount, adminSigner);

    let expectedState = await getCurrentState(fixture, validators);
    expectedState.StakeNFT.ETH = BigInt(0);
    //Expect that NFT are transferred from ValidatorPool to Factory
    for (let index = 0; index < validators.length; index++) {
      expectedState.ValidatorPool.StakeNFT++;
      expectedState.Factory.StakeNFT--;
      expectedState.validators[index].Acc = true;
      expectedState.validators[index].ExQ = true;
    }
    await factoryCallAny(fixture, "validatorPool", "registerValidators", [
      validators,
      stakingTokenIds,
    ]);
    await factoryCallAny(fixture, "validatorPool", "unregisterValidators", [
      validators,
    ]);
    let currentState = await getCurrentState(fixture, validators);
    expect(currentState).to.be.deep.equal(expectedState);
  });

  it("Do an ether and Madtoken deposit for the VALIDATORNFT contract before unregistering, but don’t collect the profits", async function () {
    await factoryCallAny(fixture, "validatorPool", "registerValidators", [
      validators,
      stakingTokenIds,
    ]);
    let eths = ethers.utils.parseEther("4").toBigInt();
    let mads = ethers.utils.parseEther("4").toBigInt();
    await fixture.validatorNFT.connect(adminSigner).depositEth(42, {
      value: eths,
    });
    await fixture.madToken
      .connect(adminSigner)
      .approve(fixture.validatorNFT.address, mads);
    await fixture.validatorNFT.connect(adminSigner).depositToken(42, mads);
    let expectedState = await getCurrentState(fixture, validators);

    await factoryCallAny(fixture, "validatorPool", "unregisterValidators", [
      validators,
    ]);

    for (let index = 0; index < validators.length; index++) {
      expectedState.ValidatorNFT.ETH -= eths / BigInt(validators.length);
      expectedState.ValidatorNFT.MAD -= mads / BigInt(validators.length);
      expectedState.validators[index].MAD += mads / BigInt(validators.length);
      expectedState.validators[index].Reg = false;
      expectedState.validators[index].ExQ = true;
    }
    expectedState.ValidatorNFT.MAD -= stakeAmount * BigInt(validators.length);
    expectedState.StakeNFT.MAD += stakeAmount * BigInt(validators.length);
    expectedState.ValidatorPool.ValNFT -= BigInt(validators.length);
    expectedState.ValidatorPool.StakeNFT += BigInt(validators.length);

    let currentState = await getCurrentState(fixture, validators);

    expect(currentState).to.be.deep.equal(expectedState);
  });
});