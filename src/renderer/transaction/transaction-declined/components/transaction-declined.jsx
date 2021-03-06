import * as React from 'react';
import TransactionErrorBox from '../../common/transaction-error-box';
import { Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
	bodyText: {
		textAlign: 'justify'
	}
});

export const TransactionDeclined = withStyles(styles)(
	({ classes, publicKey, closeAction, match }) => {
		return (
			<TransactionErrorBox
				publicKey={publicKey}
				closeAction={closeAction}
				subtitle="Transaction Declined"
			>
				<Typography variant="body1" className={classes.bodyText}>
					You declined this transaction on your {match.params.device} device
				</Typography>
			</TransactionErrorBox>
		);
	}
);

export default TransactionDeclined;
