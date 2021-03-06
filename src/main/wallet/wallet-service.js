import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import { Wallet } from './wallet';
import fs from 'fs';
import path from 'path';
import { formatDataUrl, bufferFromDataUrl } from 'common/utils/document';
import EthUnits from 'common/utils/eth-units';
import EthUtil from 'ethereumjs-util';

const log = new Logger('wallet-model');
export class WalletService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
	}

	async createWallet(password) {
		const account = this.web3Service.web3.eth.accounts.create(password);
		this.web3Service.web3.eth.accounts.wallet.add(account);
		this.web3Service.web3.eth.defaultAccount = account.address;
		const { address, privateKey } = account;
		const keystore = this.web3Service.web3.eth.accounts.encrypt(privateKey, password);
		const keystoreFileFullPath = path.resolve(
			getGlobalContext().config.walletsDirectoryPath,
			address
		);
		try {
			await fs.promises.writeFile(keystoreFileFullPath, JSON.stringify(keystore), 'utf8');
		} catch (error) {
			log.error(error);
		}
		const wallet = await Wallet.create({
			publicKey: address,
			keystoreFilePath: keystoreFileFullPath,
			profile: 'local'
		});

		const newWallet = {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			publicKey: address,
			privateKey: privateKey,
			keystoreFilePath: keystoreFileFullPath
		};

		return newWallet;
	}

	async copyKeystoreFile(id, toPath) {
		const wallet = await Wallet.findById(id);
		try {
			await fs.promises.copyFile(
				wallet.keystoreFilePath,
				path.resolve(toPath, wallet.publicKey)
			);
			return true;
		} catch (error) {
			log.error(error);
			return false;
		}
	}

	async getBalance(id) {
		const wallet = await Wallet.findById(id);
		const balanceInWei = await this.web3Service.web3.eth.getBalance(wallet.publicKey);
		return EthUnits.toEther(balanceInWei, 'wei');
	}

	async getWallets() {
		const wallets = await Wallet.findAllWithKeyStoreFile();
		return wallets.map(w => ({ ...w, profilePicture: formatDataUrl(w.profilePicture) }));
	}

	async unlockWalletWithPassword(id, password) {
		const wallet = await Wallet.findById(id);
		let keystoreFilePath = wallet.keystoreFilePath;
		try {
			await fs.promises.access(keystoreFilePath, fs.constants.R_OK);
		} catch (error) {
			keystoreFilePath = path.resolve(
				getGlobalContext().config.walletsDirectoryPath,
				keystoreFilePath
			);
		}
		let keystore = await fs.promises.readFile(keystoreFilePath);
		const account = this.web3Service.web3.eth.accounts.decrypt(
			keystore.toString('utf8'),
			password,
			true
		);
		this.web3Service.web3.eth.accounts.wallet.add(account);
		this.web3Service.web3.eth.defaultAccount = account.address;

		if (!account) {
			throw new Error('Wrong Password!');
		}
		return {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			publicKey: account.address,
			privateKey: account.privateKey
		};
	}

	async unlockWalletWithNewFile(filePath, password) {
		const keystore = await fs.promises.readFile(filePath);
		const account = this.web3Service.web3.eth.accounts.decrypt(
			keystore.toString('utf8'),
			password,
			true
		);
		this.web3Service.web3.eth.accounts.wallet.add(account);
		this.web3Service.web3.eth.defaultAccount = account.address;

		if (!account) {
			throw new Error('Wrong Password!');
		}

		const keystoreFileFullPath = path.resolve(
			getGlobalContext().config.walletsDirectoryPath,
			account.address
		);

		await fs.promises.copyFile(filePath, keystoreFileFullPath);

		let wallet = await Wallet.findByPublicKey(account.address);

		wallet = !wallet
			? await Wallet.create({
					publicKey: account.address,
					keystoreFilePath: keystoreFileFullPath,
					profile: 'local'
			  })
			: wallet;

		const newWallet = {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			publicKey: account.address,
			privateKey: account.privateKey,
			keystoreFilePath: keystoreFileFullPath
		};

		return newWallet;
	}

	async unlockWalletWithPrivateKey(privateKey) {
		if (!EthUtil.isValidPrivate(Buffer.from(privateKey.replace('0x', ''), 'hex'))) {
			throw new Error('The private key you entered is incorrect. Please try again!');
		}
		const account = this.web3Service.web3.eth.accounts.privateKeyToAccount(privateKey);
		this.web3Service.web3.eth.accounts.wallet.add(account);
		this.web3Service.web3.eth.defaultAccount = account.address;

		let wallet = await Wallet.findByPublicKey(account.address);

		wallet = !wallet
			? await Wallet.create({
					publicKey: account.address,
					profile: 'local'
			  })
			: wallet;

		const newWallet = {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			publicKey: account.address,
			privateKey: account.privateKey
		};

		return newWallet;
	}

	async unlockWalletWithPublicKey(publicKey, path, profile) {
		let wallet = await Wallet.findByPublicKey(publicKey);
		this.web3Service.web3.eth.defaultAccount = publicKey;

		wallet = !wallet
			? await Wallet.create({
					publicKey,
					profile,
					path
			  })
			: wallet;

		return wallet;
	}

	async _getWallets(page, accountsQuantity) {
		return new Promise((resolve, reject) => {
			this.web3Service.web3.eth.getAccounts((error, accounts) => {
				if (error) {
					log.info('error: %j', error);
					reject(error);
				} else {
					const promises = accounts.map(async (address, index) => {
						const balanceInWei = await this.web3Service.web3.eth.getBalance(address);
						return {
							address,
							balance: EthUnits.toEther(balanceInWei, 'wei'),
							path: `44'/60'/0'/${page * accountsQuantity + index}`
						};
					});
					resolve(Promise.all(promises));
				}
			});
		});
	}

	updateWalletAvatar(avatar, id) {
		return Wallet.updateProfilePicture({
			id,
			profilePicture: bufferFromDataUrl(avatar)
		});
	}

	updateWalletName(name, id) {
		return Wallet.updateName({
			id,
			name: name
		});
	}

	updateWalletSetup(setup, id) {
		return Wallet.updateSetup({
			id,
			setup: setup
		});
	}

	async getLedgerWallets(page, accountsQuantity) {
		await this.web3Service.switchToLedgerWallet(page, accountsQuantity);
		return this._getWallets(page, accountsQuantity);
	}

	async getTrezorWallets(page, accountsQuantity, eventEmitter) {
		await this.web3Service.switchToTrezorWallet(page, accountsQuantity, eventEmitter);
		return this._getWallets(page, accountsQuantity);
	}

	sendTransaction(transactionObject) {
		return this.web3Service.web3.eth.sendTransaction(transactionObject);
	}
}

export default WalletService;
