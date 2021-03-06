/* istanbul ignore file */
'use strict';
const path = require('path');
const dotenv = require('dotenv');
const electron = require('electron');

const { isDevMode, isTestMode, getSetupFilePath, getUserDataPath } = require('./utils/common');
const pkg = require('../../package.json');

dotenv.config();
const DEBUG_REQUEST = process.env.DEBUG_REQUEST === '1';
if (DEBUG_REQUEST) {
	require('request').debug = true;
}
const CHAIN_ID = process.env.CHAIN_ID_OVERRIDE;
const NODE = process.env.NODE_OVERRIDE;
const PRIMARY_TOKEN = process.env.PRIMARY_TOKEN_OVERRIDE
	? process.env.PRIMARY_TOKEN_OVERRIDE.toUpperCase()
	: null;

const INCORPORATIONS_TEMPLATE_OVERRIDE = process.env.INCORPORATIONS_TEMPLATE_OVERRIDE;
const INCORPORATIONS_PRICE_OVERRIDE = process.env.INCORPORATIONS_PRICE_OVERRIDE;
const INCORPORATION_KYCC_INSTANCE = process.env.INCORPORATION_KYCC_INSTANCE;
const INCORPORATION_API_URL = process.env.INCORPORATION_API_URL;
const INCORPORATION_TREATIES_URL = process.env.INCORPORATION_TREATIES_URL;
const COUNTRY_INFO_URL = process.env.COUNTRY_INFO_URL;
const MATOMO_SITE = process.env.MATOMO_SITE;

let userDataDirectoryPath = '';
let walletsDirectoryPath = '';
if (electron.app) {
	userDataDirectoryPath = electron.app.getPath('userData');
	walletsDirectoryPath = path.resolve(userDataDirectoryPath, 'wallets');
}

const common = {
	defaultLanguage: 'en',
	forceUpdateAttributes: process.env.FORCE_UPDATE_ATTRIBUTES === 'true' && !isTestMode(),
	userAgent: `SelfKeyIDW/${pkg.version}`,

	incorporationsInstance:
		INCORPORATION_KYCC_INSTANCE || 'https://apiv2.instance.kyc-chain.com/api/v2/',
	incorporationsPriceOverride: INCORPORATIONS_PRICE_OVERRIDE,
	incorporationsTemplateOverride: INCORPORATIONS_TEMPLATE_OVERRIDE,
	incorporationApiUrl: INCORPORATION_API_URL || 'https://passports.io/api/incorporations',
	incorporationTreatiesUrl: INCORPORATION_TREATIES_URL || 'https://passports.io/api/tax-treaties',
	countryInfoUrl: COUNTRY_INFO_URL || 'https://passports.io/api/country',

	constants: {
		initialIdAttributes: {
			REQ_1: { id: '1', attributeType: 'name' },
			REQ_2: { id: '1', attributeType: 'email' },
			REQ_3: { id: '1', attributeType: 'country_of_residency' },
			REQ_4: { id: '1', attributeType: 'national_id' },
			REQ_5: { id: '2', attributeType: 'national_id', selfie: true }
		},
		idAttributeTypeAdditions: {
			selfie: 'addition_with_selfie',
			signature: 'addition_with_signature',
			notary: 'addition_with_notary',
			certified_true_copy: 'addition_with_certified_true_copy'
		},
		primaryToken: PRIMARY_TOKEN || 'KEY'
	},
	notificationTypes: {
		wallet: {
			icon: 'wallet-without-color',
			title: 'the wallet title',
			color: 'green'
		},
		notification: {
			icon: 'appointment-reminders-without-color',
			title: 'you got a notification',
			color: 'yellow'
		}
	},
	reminderTypes: {
		regular: {
			icon: 'appointment-reminders-without-color',
			title: 'you got a reminder',
			color: 'blue'
		}
	},
	allowedUrls: [
		'https://youtube.com/',
		'https://etherscan.io/',
		'https://selfkey.org/',
		'https://help.selfkey.org/',
		'https://help.selfkey.org/',
		'https://blog.selfkey.org/',
		'https://selfkey.org/wp-content/uploads/2017/11/selfkey-whitepaper-en.pdf',
		'https://t.me/selfkeyfoundation'
	]
};

const dev = {
	debug: true,
	dev: true,
	qa: true,
	updateEndpoint: 'http://localhost:5000',
	kycApiEndpoint: 'https://token-sale-demo-api.kyc-chain.com/',
	chainId: 3,
	node: 'infura',
	incorporationsInstance:
		INCORPORATION_KYCC_INSTANCE || 'https://apiv2.instance.kyc-chain.com/api/v2/',

	constants: {
		primaryToken: PRIMARY_TOKEN || 'KI'
	},
	matomoSite: 2
};

const prod = {
	debug: false,
	dev: false,
	qa: true,
	updateEndpoint: 'https://release.selfkey.org',
	kycApiEndpoint: 'https://tokensale-api.selfkey.org/',
	chainId: 1,
	node: 'infura',
	incorporationsInstance:
		INCORPORATION_KYCC_INSTANCE || 'https://flagtheory-v2.instance.kyc-chain.com/api/v2/',
	constants: {
		primaryToken: PRIMARY_TOKEN || 'KEY'
	},
	matomoSite: 1
};

const setupFilesPath = getSetupFilePath();
let dbFileName = path.join(getUserDataPath(), 'IdentityWalletStorage.sqlite');

const db = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: dbFileName
	},
	migrations: {
		directory: path.join(setupFilesPath, 'main', 'migrations')
	},
	seeds: {
		directory: path.join(setupFilesPath, 'main', 'seeds')
	}
	// acquireConnectionTimeout: 6000
};
if (isTestMode()) {
	db.connection = ':memory:';
	db.pool = {
		min: 1,
		max: 1,
		disposeTiemout: 360000 * 1000,
		idleTimeoutMillis: 360000 * 1000
	};
}

let conf = prod;

if (isDevMode()) {
	conf = dev;
}

if (CHAIN_ID) {
	conf.chainId = Number(CHAIN_ID);
}

if (MATOMO_SITE) {
	conf.matomoSite = Number(MATOMO_SITE);
}

if (NODE) {
	conf.node = NODE;
}

module.exports = {
	common,
	...common,
	db,
	...conf,
	userDataDirectoryPath,
	walletsDirectoryPath
};
