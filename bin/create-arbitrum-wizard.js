#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const TEMPLATE_PATH = path.join(__dirname, '../templates');

async function promptUser() {
  // @ts-ignore
  return await inquirer.prompt([
    { type: 'input', name: 'projectName', message: 'Enter project name:', default: 'eth_project' },
    { type: 'confirm', name: 'includeBackend', message: 'Include FastAPI backend?', default: true },
    { type: 'confirm', name: 'includeSmartContracts', message: 'Include Solidity smart contracts?', default: true },
    { type: 'confirm', name: 'includeFrontend', message: 'Include React frontend?', default: true },
  ]);
}

async function setupDirectoryStructure(basePath, options) {
  console.log(chalk.green('\nSetting up base structure...'));
  const dirs = ['contracts', 'scripts', 'docs'];

  if (options.includeBackend) dirs.push('backend');
  if (options.includeFrontend) dirs.push(path.join('frontend', 'src'));

  for (const dir of dirs) {
    await fs.ensureDir(path.join(basePath, dir));
  }
}

async function createSolidityContract(basePath) {
  console.log(chalk.green('Creating Solidity smart contract...'));
  const contractContent = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC20Token {
    string public name = "Ethereum Token";
    string public symbol = "ETH";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
  `;
  await fs.writeFile(path.join(basePath, 'contracts', 'ERC20Token.sol'), contractContent);
}

async function createBackend(basePath) {
  console.log(chalk.green('Creating FastAPI backend files...'));
  const backendPath = path.join(basePath, 'backend');

  const mainPyContent = `
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ethereum DApp Backend"}
  `;
  await fs.writeFile(path.join(backendPath, 'main.py'), mainPyContent);

  const requirementsContent = `
fastapi
uvicorn
  `;
  await fs.writeFile(path.join(backendPath, 'requirements.txt'), requirementsContent);
}

async function createFrontend(basePath) {
  console.log(chalk.green('Creating frontend files...'));
  const frontendPath = path.join(basePath, 'frontend');

  const packageJsonContent = {
    name: "eth-frontend",
    version: "0.1.0",
    main: "index.js",
    scripts: {
      start: "react-scripts start",
      build: "react-scripts build",
      test: "react-scripts test",
      eject: "react-scripts eject"
    },
    dependencies: {
      react: "^17.0.2",
      "react-dom": "^17.0.2",
      "react-scripts": "4.0.3",
      web3: "^1.6.1"
    },
    eslintConfig: {
      extends: ["react-app", "react-app/jest"]
    },
    browserslist: {
      production: [">0.2%", "not dead", "not op_mini all"],
      development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
    }
  };
  await fs.writeFile(path.join(frontendPath, 'package.json'), JSON.stringify(packageJsonContent, null, 2));

  const appJsContent = `
import React from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = React.useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <div>
      <h1>Welcome to Ethereum DApp</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <p>Connected account: {account}</p>}
    </div>
  );
}

export default App;
  `;
  await fs.writeFile(path.join(frontendPath, 'src', 'App.js'), appJsContent);
}

async function createDeploymentScript(basePath) {
  console.log(chalk.green('Creating deployment script...'));
  const scriptContent = `
// This script will handle the deployment of your contracts
console.log("Deploying contracts...");
  `;
  await fs.writeFile(path.join(basePath, 'scripts', 'deploy.js'), scriptContent);
}

async function createReadme(basePath, projectName) {
  console.log(chalk.green('Creating README file...'));
  const readmeContent = `# ${projectName}

This is a template project for developing DApps on the Ethereum blockchain.

## Project Structure

- **contracts/**: Contains Solidity smart contracts.
- **backend/**: Contains the FastAPI backend.
- **frontend/**: Contains the React frontend.
- **scripts/**: Contains deployment scripts.
- **docs/**: Contains documentation files.

## Getting Started

1. Clone the repository.
2. Install dependencies for backend:
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   \`\`\`
3. Install dependencies for frontend:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`
4. Run the backend:
   \`\`\`bash
   uvicorn main:app --reload
   \`\`\`
5. Run the frontend:
   \`\`\`bash
   npm start
   \`\`\`
  `;
  await fs.writeFile(path.join(basePath, 'docs', 'README.md'), readmeContent);
}

async function createProject() {
  console.log(chalk.blue('\nWelcome to the Ethereum Wizard CLI!'));

  const { projectName, includeBackend, includeSmartContracts, includeFrontend } = await promptUser();
  const projectPath = path.join(process.cwd(), projectName);

  try {
    console.log(chalk.green(`\nCreating project at ${projectPath}`));
    await fs.ensureDir(projectPath);

    await setupDirectoryStructure(projectPath, { includeBackend, includeFrontend });

    if (includeSmartContracts) await createSolidityContract(projectPath);
    if (includeBackend) await createBackend(projectPath);
    if (includeFrontend) await createFrontend(projectPath);

    await createDeploymentScript(projectPath);
    await createReadme(projectPath, projectName);

    console.log(chalk.green(`\nProject ${projectName} created successfully!`));
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
  }
}

createProject();
