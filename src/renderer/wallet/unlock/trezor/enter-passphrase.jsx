import React, { Component } from 'react';
import { Modal, Typography, Grid, Button, Input, InputAdornment } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import {
	ModalWrap,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	ModalCloseIcon,
	VisibilityOffIcon,
	VisibilityOnIcon
} from 'selfkey-ui';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';

const styles = theme => ({
	pointer: {
		cursor: 'pointer'
	}
});

class EnterPassphrase extends Component {
	state = {
		passphrase: '',
		rePassphrase: '',
		error: '',
		inputType: 'password',
		visibilityComponent: <VisibilityOffIcon />
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			this.setState({ error: this.props.error });
		}
	}

	handleVisibility = event => {
		if (this.state.inputType === 'password') {
			this.setState({
				...this.state,
				inputType: 'text',
				visibilityComponent: <VisibilityOnIcon />
			});
		} else {
			this.setState({
				...this.state,
				inputType: 'password',
				visibilityComponent: <VisibilityOffIcon />
			});
		}
	};

	handlePassphraseChange = async event => {
		const passphrase = event.target.value;
		if (this.state.error) {
			await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
		this.setState({ passphrase });
	};

	handleRePassphraseChange = async event => {
		const rePassphrase = event.target.value;
		if (this.state.error) {
			await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
		this.setState({ rePassphrase });
	};

	handleEnter = async () => {
		if (this.state.passphrase !== this.state.rePassphrase) {
			this.setState({ error: 'Passphrase and Reconfirm passphrase must be equal.' });
		} else {
			await this.props.dispatch(
				appOperations.enterTrezorPassphraseOperation(null, this.state.passphrase)
			);
			if (this.props.goNextPath !== '') {
				await this.props.dispatch(push(this.props.goNextPath));
			}
		}
	};

	handleCancel = async () => {
		await this.props.dispatch(
			appOperations.enterTrezorPassphraseOperation(new Error('cancel'), null)
		);
		await this.props.dispatch(push('/unlockWallet/trezor'));
	};

	renderModalBody = () => {
		const { classes } = this.props;
		return (
			<Grid container direction="column" justify="center" alignItems="center" spacing={40}>
				<Grid item>
					<Typography variant="h1">Please Enter Your Passphrase.</Typography>
				</Grid>
				<Grid item>
					<Typography variant="h3">
						Note that your passphrase is case-sensitive.
					</Typography>
				</Grid>
				<Grid item>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="flex-start"
						spacing={8}
					>
						<Grid item>
							<Typography variant="overline" gutterBottom>
								PASSPHRASE
							</Typography>
						</Grid>
						<Grid item>
							<Input
								fullWidth
								error={this.state.error !== ''}
								endAdornment={
									<InputAdornment position="start" className={classes.pointer}>
										<div onClick={this.handleVisibility}>
											{this.state.visibilityComponent}
										</div>
									</InputAdornment>
								}
								type={this.state.inputType}
								onChange={this.handlePassphraseChange}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="flex-start"
						spacing={8}
					>
						<Grid item>
							<Typography variant="overline" gutterBottom>
								RECONFIRM PASSPHRASE
							</Typography>
						</Grid>
						<Grid item>
							<Input
								fullWidth
								error={this.state.error !== ''}
								endAdornment={
									<InputAdornment position="start" className={classes.pointer}>
										<div onClick={this.handleVisibility}>
											{this.state.visibilityComponent}
										</div>
									</InputAdornment>
								}
								type={this.state.inputType}
								onChange={this.handleRePassphraseChange}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					{this.state.error !== '' && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{this.state.error}
						</Typography>
					)}
				</Grid>
				<Grid item>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="center"
						spacing={24}
					>
						<Grid item>
							<Button variant="contained" size="large" onClick={this.handleEnter}>
								ENTER
							</Button>
						</Grid>
						<Grid item>
							<Button variant="outlined" size="large" onClick={this.handleCancel}>
								CANCEL
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	};

	render() {
		return (
			<div>
				<Modal open={true}>
					<ModalWrap>
						<ModalCloseButton onClick={this.handleCancel}>
							<ModalCloseIcon />
						</ModalCloseButton>
						<ModalHeader>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
							>
								<Grid item>
									<Typography variant="h6">Trezor PASSPHRASE</Typography>
								</Grid>
							</Grid>
						</ModalHeader>
						<ModalBody>{this.renderModalBody()}</ModalBody>
					</ModalWrap>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const app = appSelectors.selectApp(state);
	return {
		error: app.error,
		goNextPath: appSelectors.selectGoNextPath(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(EnterPassphrase));
