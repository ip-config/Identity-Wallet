import { WalletToken } from './wallet-token';
import { getGlobalContext } from 'common/context';
import EthUtils from 'common/utils/eth-utils';

export class WalletTokenService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
		this.contractABI = this.web3Service.abi;
	}

	getWalletTokens(walletId) {
		return WalletToken.findByWalletId(walletId, true);
	}

	// TODO use the test ABI when in dev mode
	async getTokenBalance(contractAddress, address) {
		const tokenContract = new this.web3Service.web3.eth.Contract(
			this.contractABI,
			contractAddress
		);
		const balanceWei = await tokenContract.methods.balanceOf(address).call();
		const decimals = await tokenContract.methods.decimals().call();
		return EthUtils.getBalanceDecimal(balanceWei, decimals);
	}

	createWalletToken(tokenId, walletId) {
		return WalletToken.create({ tokenId, walletId });
	}

	updateState(id, state) {
		return WalletToken.update({ id, recordState: state });
	}
}

export default WalletTokenService;
