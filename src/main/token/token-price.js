import BaseModel from '../common/base-model';

const TABLE_NAME = 'token_prices';

export class TokenPrice extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['name', 'symbol'],
			properties: {
				id: { type: 'integer' },
				name: { type: 'string' },
				symbol: { type: 'string' },
				source: { type: 'string' },
				priceUSD: { type: 'number' },
				priceBTC: { type: 'number' },
				priceETH: { type: 'number' }
			}
		};
	}

	static findAll() {
		return this.query();
	}

	static findBySymbol(symbol) {
		return this.query().findOne({ symbol });
	}

	static create(data) {
		return this.query().insertAndFetch(data);
	}

	static updateById(id, data) {
		return this.query().patchAndFetchById(id, data);
	}

	static bulkEdit(items) {
		return this.updateMany(items);
	}

	static bulkAdd(items) {
		return this.insertMany(items);
	}
}

export default TokenPrice;
