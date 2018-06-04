import log from './log';
const metadata = require('../../metadata.json');
const defaultConfig = {
	customPurposeListLocation: null,
	globalVendorListLocation: metadata.globalVendorListLocation,
	globalConsentLocation: metadata.globalConsentLocation,
	storeConsentGlobally: true,
	storePublisherData: true,
	logging: false,
	localization: {},
	forceLocale: null,
	gdprAppliesGlobally: false,
	repromptOptions: {
		fullConsentGiven: 360,
		someConsentGiven: 30,
		noConsentGiven: 30,
	},
	geoIPVendor: 'https://cmp.digitru.st/1/geoip.json',
	testingMode: 'normal',
	layout: null,
	css: {
		"color-primary": "#0a82be",
		"color-secondary": "#eaeaea",
		"color-border": "#eaeaea",
		"color-background": "#ffffff",
		"color-text-primary": "#333333",
		"color-text-secondary": "#0a82be",
		"color-linkColor": "#0a82be",
		"color-table-background": "#f7f7f7",
		"font-family": "'Helvetica Neue', Helvetica, Arial, sans-serif",
		"custom-font-url": null
	}
};

class Config {
	constructor() {
		this.individualOverwritesAllowed = [
			"repromptOptions",
			"css",
		];
		this.update(defaultConfig);
	}

	update = (updates) => {
		const self = this;
		if (updates && typeof updates === 'object') {
			const validKeys = Object.keys(defaultConfig);
			const { validUpdates, invalidKeys } = Object.keys(updates).reduce((acc, key) => {
				if (validKeys.indexOf(key) > -1) {
					if (self.individualOverwritesAllowed.indexOf(key) > -1) {
						let obj = defaultConfig[key];
						for (let k in updates[key]) {
							obj[k] = updates[key][k];
						}
						acc.validUpdates = {
							...acc.validUpdates,
							[key]: obj
						};
					} else {
						acc.validUpdates = {
							...acc.validUpdates,
							[key]: updates[key]
						};
					}
				}
				else {
					acc.invalidKeys.push(key);
				}
				return acc;
			}, { validUpdates: {}, invalidKeys: [] });

			Object.assign(this, validUpdates);
			if (invalidKeys.length) {
				log.warn(`Invalid CMP config values not applied: ${invalidKeys.join(', ')}`);
			}

		}
	};
}

export default new Config();
