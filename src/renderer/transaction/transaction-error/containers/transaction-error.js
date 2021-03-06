import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionError } from '../components/transaction-error';
import { getWallet } from 'common/wallet/selectors';
import { push } from 'connected-react-router';
import { kycOperations } from 'common/kyc';

class TransactionErrorContainer extends Component {
	componentDidMount() {
		this.clearRelyingParty();
	}
	clearRelyingParty = async () => {
		// Clear relying party session after an application failure
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};
	closeAction = () => {
		this.props.dispatch(push('/main/dashboard'));
	};
	render() {
		return <TransactionError closeAction={this.closeAction} {...this.props} />;
	}
}

const mapStateToProps = state => {
	return {
		publicKey: getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(TransactionErrorContainer);
