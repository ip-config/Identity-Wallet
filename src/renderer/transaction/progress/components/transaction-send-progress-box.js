import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { TransactionBox } from '../../common/transaction-box';
import { Grid, Typography, withStyles, Button } from '@material-ui/core';
import { HourGlassLargeIcon, OkayIcon, NumberFormat } from 'selfkey-ui';

const styles = theme => ({
	amount: {
		fontSize: '40px',
		fontWeight: 300,
		lineHeight: '48px'
	},
	address: {
		color: '#FFFFFF',
		fontSize: '20px',
		letterSpacing: '1px',
		lineHeight: '24px'
	},
	sentTo: {
		color: '#93B0C1',
		fontSize: '18px',
		lineHeight: '28px'
	},
	actions: {
		marginTop: '20px'
	}
});

const handleViewTransaction = (event, openLink, transactionHash) => {
	event && event.preventDefault();
	if (!openLink) {
		return;
	}
	openLink(`https://etherscan.io/tx/${transactionHash}`);
};

const renderIcon = status => {
	if (status === 'Pending') {
		return <HourGlassLargeIcon />;
	} else if (status === 'Sent!') {
		return <OkayIcon />;
	}
};

export const TransactionSendProgressBox = withStyles(styles)(
	({
		classes,
		cryptoCurrency,
		closeAction,
		amount,
		address,
		openLink,
		locale,
		status,
		transactionHash
	}) => {
		return (
			<TransactionBox
				cryptoCurrency={cryptoCurrency}
				closeAction={closeAction}
				title={`Send ${cryptoCurrency}`}
			>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="stretch"
					spacing={40}
					zeroMinWidth
				>
					<Grid item xs={2}>
						{renderIcon(status)}
					</Grid>
					<Grid item xs={10}>
						<Grid container direction="column" spacing={16}>
							<Grid item>
								<Typography variant="h4">{status}</Typography>
							</Grid>
							<Grid item>
								<Grid container spacing={8}>
									<Grid item className={classes.amount}>
										<NumberFormat
											locale={locale}
											style="decimal"
											currency={cryptoCurrency}
											value={amount}
											fractionDigits={15}
										/>
									</Grid>
									<Grid item className={classes.amount}>
										{cryptoCurrency}
									</Grid>
								</Grid>
							</Grid>

							<Grid item>
								<Typography variant="body2" className={classes.sentTo}>
									send to
								</Typography>
								<Typography variant="headline" className={classes.address}>
									{address}
								</Typography>
							</Grid>
							{transactionHash && (
								<Grid item className={classes.actions}>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="flex-start"
										spacing={24}
									>
										<Grid item>
											<Button
												variant="contained"
												onClick={e =>
													handleViewTransaction(
														e,
														openLink,
														transactionHash
													)
												}
											>
												VIEW TRANSACTION
											</Button>
										</Grid>
										<Grid item>
											<CopyToClipboard text={transactionHash}>
												<Button variant="outlined">
													COPY TRANSACTION ID
												</Button>
											</CopyToClipboard>
										</Grid>
									</Grid>
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>
			</TransactionBox>
		);
	}
);

export default TransactionSendProgressBox;
