## Steps to run the project locally

#### Before starting

Generate a `.env` file on both folders and complete following `.env.template` template file

#### From the hardhat folder:

1. Run tests to make sure everything works as expected

`npx hardhat test`

2. Run a mainnet fork locally

`npx hardhat node --network hardhat`

3. Deploy index deployer to the mainnet fork

`npx hardhat run --network localhost scripts/deploy.localhost.ts`

4. (IF NEEDED) Recompile contracts so the abi's are exported to the react project folder

`npx hardhat compile --force`

#### From the react folder:

1. Add the index deployer address (printed on the deploy script logs) to the `.env` file
2. Run react client

`npm run start`

2. Connect to localhost network on the client
3. Wait for multicall contract to be deployed automatically
4. Grab the multicall contract address from the hardhat logs and add it to `config.ts`
