import React from 'react';
import { connect } from 'react-redux';
import { getExchanges } from 'common/exchanges/selectors';
import { ExchangeSmallIcon } from 'selfkey-ui';
import { marketplacesSelectors } from '../../../common/marketplaces';
import { MarketplaceServicesPage } from './services-page';

const mapStateToProps = (state, props) => {
	return {
		items: getExchanges(state),
		category: {
			...marketplacesSelectors.categorySelector(state, 'exchanges'),
			icon: <ExchangeSmallIcon />
		}
	};
};

export const MarketplaceExchangesPage = connect(mapStateToProps)(MarketplaceServicesPage);

export default MarketplaceExchangesPage;
