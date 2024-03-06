const { ethers } = require("hardhat")
const { Wallet } = ethers

const lsdNetworkFactoryAddress = process.env.LSD_NETWORK_FACTORY_ADDRESS
console.log("ethers version:", ethers.version)

async function main() {
    if (!lsdNetworkFactoryAddress) throw new Error("lsd network factory address is required")

    const networkAdmin = new Wallet(process.env.NETWORK_ADMIN_PRIVATE_KEY, ethers.provider)
    const voter1 = process.env.ACCOUNT_VOTER1
    const voter2 = process.env.ACCOUNT_VOTER2
    const voter3 = process.env.ACCOUNT_VOTER3
    const voters = [voter1, voter2, voter3]
    console.log("network admin account address:\t", networkAdmin.address)
    console.log("voter1 address:\t", voter1)
    console.log("voter2 address:\t", voter2)
    console.log("voter3 address:\t", voter3)

    console.log("ContractLsdNetworkFactory address:\t", lsdNetworkFactoryAddress)
    const ContractLsdNetworkFactory = await ethers.getContractAt("LsdNetworkFactory", lsdNetworkFactoryAddress, networkAdmin)

    await ContractLsdNetworkFactory
        .createLsdNetwork('rETH Test', 'rTETH', networkAdmin.address, voters, 2)
    
    const lsdTokens = await ContractLsdNetworkFactory.lsdTokensOfCreater(networkAdmin.address)
    const lsdTokenAddress = lsdTokens[lsdTokens.length - 1]
    console.log("LSDTokenAddress address:\t", lsdTokenAddress);

    const contracts = await ContractLsdNetworkFactory.networkContractsOfLsdToken(lsdTokenAddress)
    // console.log(contracts);
    const ContractFeePool = await ethers.getContractAt("LsdNetworkFactory", contracts._feePool, networkAdmin)
    console.log("FeePoolAddress address:\t\t", ContractFeePool.address)
    const ContractNetworkBalances = await ethers.getContractAt("INetworkBalances", contracts._networkBalances, networkAdmin)
    console.log("NetworkBalancesAddress address:\t", ContractNetworkBalances.address)
    const ContractNetworkProposal = await ethers.getContractAt("INetworkProposal", contracts._networkProposal, networkAdmin)
    console.log("NetworkProposalAddress address:\t", ContractNetworkProposal.address)
    const ContractNodeDeposit = await ethers.getContractAt("INodeDeposit", contracts._nodeDeposit, networkAdmin)
    console.log("NodeDepositAddress address:\t", ContractNodeDeposit.address)
    const ContractUserDeposit = await ethers.getContractAt("IUserDeposit", contracts._userDeposit, networkAdmin)
    console.log("UserDepositAddress address:\t", ContractUserDeposit.address)
    const ContractNetworkWithdraw = await ethers.getContractAt("INetworkWithdraw", contracts._networkWithdraw, networkAdmin)
    console.log("NetworkWithdrawAddress address:\t", ContractNetworkWithdraw.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })