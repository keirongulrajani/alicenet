import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";
import { Artifacts, RunTaskFunction } from "hardhat/types";
import { DEFAULT_CONFIG_OUTPUT_DIR, INITIALIZER } from "../constants";
import { readDeploymentArgs } from "./deploymentConfigUtil";

type Ethers = typeof import("../../../node_modules/ethers/lib/ethers") &
  HardhatEthersHelpers;

export interface ArgData {
  [key: string]: string;
}
export interface ContractArgs {
  [key: string]: Array<ArgData>;
}
export interface DeploymentArgs {
  constructor: ContractArgs;
  initializer: ContractArgs;
}

export interface InitData {
  constructorArgs: { [key: string]: any };
  initializerArgs: { [key: string]: any };
}

// function to deploy the factory
export async function deployFactory(run: RunTaskFunction, usrPath?: string) {
  return await run("deployFactory", { outputFolder: usrPath });
}

export async function deployStatic(
  fullyQualifiedName: string,
  artifacts: Artifacts,
  ethers: Ethers,
  run: RunTaskFunction,
  inputFolder?: string,
  outputFolder?: string
) {
  let initCallData;
  // check if contract needs to be initialized
  const initAble = await isInitializable(fullyQualifiedName, artifacts);
  if (initAble) {
    const initializerArgs = await getDeploymentInitializerArgs(
      fullyQualifiedName,
      inputFolder
    );
    initCallData = await getEncodedInitCallData(initializerArgs);
  }

  const hasConArgs = await hasConstructorArgs(fullyQualifiedName, artifacts);
  const constructorArgs = hasConArgs
    ? await getDeploymentConstructorArgs(fullyQualifiedName)
    : [];
  return await run("deployMetamorphic", {
    contractName: extractName(fullyQualifiedName),
    initCallData,
    constructorArgs,
    outputFolder,
  });
}

export async function deployUpgradeableProxy(
  fullyQualifiedName: string,
  artifacts: Artifacts,
  ethers: Ethers,
  run: RunTaskFunction,
  inputFolder?: string,
  outputFolder?: string
) {
  let initCallData;
  const initAble = await isInitializable(fullyQualifiedName, artifacts);
  if (initAble) {
    const initializerArgs = await getDeploymentInitializerArgs(
      fullyQualifiedName,
      inputFolder
    );
    initCallData = await getEncodedInitCallData(initializerArgs);
  }
  const hasConArgs = await hasConstructorArgs(fullyQualifiedName, artifacts);
  const constructorArgs = hasConArgs
    ? await getDeploymentConstructorArgs(fullyQualifiedName, inputFolder)
    : [];
  return await run("deployUpgradeableProxy", {
    contractName: extractName(fullyQualifiedName),
    initCallData,
    constructorArgs,
    outputFolder,
  });
}

export async function isInitializable(
  fullyQualifiedName: string,
  artifacts: Artifacts
) {
  const buildInfo: any = await artifacts.getBuildInfo(fullyQualifiedName);
  const path = extractPath(fullyQualifiedName);
  const name = extractName(fullyQualifiedName);
  const methods = buildInfo.output.contracts[path][name].abi;
  for (const method of methods) {
    if (method.name === INITIALIZER) {
      return true;
    }
  }
  return false;
}

export async function hasConstructorArgs(
  fullName: string,
  artifacts: Artifacts
) {
  const buildInfo: any = await artifacts.getBuildInfo(fullName);
  const path = extractPath(fullName);
  const name = extractName(fullName);
  const methods = buildInfo.output.contracts[path][name].abi;
  for (const method of methods) {
    if (method.type === "constructor") {
      return method.inputs.length > 0;
    }
  }
  return false;
}

export async function getEncodedInitCallData(
  args: Array<string> | undefined
): Promise<string | undefined> {
  if (args !== undefined) {
    return args.toString().replace(",", ", ");
  }
}

export async function getContract(name: string, artifacts: Artifacts) {
  const artifactPaths = await artifacts.getAllFullyQualifiedNames();
  for (let i = 0; i < artifactPaths.length; i++) {
    if (artifactPaths[i].split(":")[1] === name) {
      return String(artifactPaths[i]);
    }
  }
}

export async function getAllContracts(artifacts: Artifacts) {
  // get a list with all the contract names
  return await artifacts.getAllFullyQualifiedNames();
}

export function extractPath(fullName: string) {
  return fullName.split(":")[0];
}

export function extractName(fullName: string) {
  return fullName.split(":")[1];
}

export async function getCustomNSTag(
  fullyQaulifiedContractName: string,
  tagName: string,
  artifacts: Artifacts
): Promise<string> {
  const buildInfo = await artifacts.getBuildInfo(fullyQaulifiedContractName);
  if (buildInfo !== undefined) {
    const name = extractName(fullyQaulifiedContractName);
    const path = extractPath(fullyQaulifiedContractName);
    const info: any = buildInfo?.output.contracts[path][name];
    return info.devdoc[`custom:${tagName}`];
  } else {
    throw new Error(`Failed to get natspec tag ${tagName}`);
  }
}

// return a list of constructor inputs for each contract
export async function getDeploymentConstructorArgs(
  fullName: string,
  configDirPath?: string
) {
  let output: Array<string> = [];
  // get the deployment args
  const path =
    configDirPath === undefined
      ? DEFAULT_CONFIG_OUTPUT_DIR + "/deploymentArgsTemplate"
      : configDirPath + "/deploymentArgsTemplate";
  const deploymentConfig: any = await readDeploymentArgs(path);
  if (deploymentConfig !== undefined) {
    const deploymentArgs: DeploymentArgs = {
      constructor: deploymentConfig.constructor,
      initializer: deploymentConfig.initializer,
    };
    if (
      deploymentArgs.constructor !== undefined &&
      deploymentArgs.constructor[fullName] !== undefined
    ) {
      output = extractArgs(deploymentArgs.constructor[fullName]);
    }
  } else {
    output = [];
  }
  return output;
}

export function extractArgs(input: Array<ArgData>) {
  const output: Array<string> = [];
  for (let i = 0; i < input.length; i++) {
    const argName = Object.keys(input[i])[0];
    const argData = input[i];
    output.push(argData[argName]);
  }
  return output;
}

// return a list of initializer inputs for each contract
export async function getDeploymentInitializerArgs(
  fullName: string,
  configDirPath?: string
) {
  let output: Array<string> | undefined;
  const path =
    configDirPath === undefined
      ? DEFAULT_CONFIG_OUTPUT_DIR + "/deploymentArgsTemplate"
      : configDirPath + "/deploymentArgsTemplate";
  const deploymentConfig: any = await readDeploymentArgs(path);
  if (deploymentConfig !== undefined) {
    const deploymentArgs: DeploymentArgs = deploymentConfig;
    if (
      deploymentArgs.initializer !== undefined &&
      deploymentArgs.initializer[fullName] !== undefined
    ) {
      output = extractArgs(deploymentArgs.initializer[fullName]);
    }
  } else {
    output = undefined;
  }
  return output;
}

export async function getSalt(fullName: string, artifacts: Artifacts) {
  return await getCustomNSTag(fullName, "salt", artifacts);
}

export async function getBytes32Salt(
  contractName: string,
  artifacts: Artifacts,
  ethers: Ethers
) {
  const salt: string = await getSalt(contractName, artifacts);

  return ethers.utils.formatBytes32String(salt);
}

export async function getDeployType(fullName: string, artifacts: Artifacts) {
  return await getCustomNSTag(fullName, "deploy-type", artifacts);
}

export async function getDeployGroup(fullName: string, artifacts: Artifacts) {
  return await getCustomNSTag(fullName, "deploy-group", artifacts);
}

export async function getDeployGroupIndex(
  fullName: string,
  artifacts: Artifacts
) {
  return await getCustomNSTag(fullName, "deploy-group-index", artifacts);
}