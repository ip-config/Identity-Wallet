import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	StyledButton,
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody
} from 'selfkey-ui';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { Grid, Modal, Typography, Input } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';

const styles = theme => ({
	errorText: {
		height: '19px',
		width: '242px',
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},

	errorColor: {
		color: '#FE4B61 !important',
		border: '2px solid #FE4B61 !important',
		backgroundColor: 'rgba(255,46,99,0.09) !important'
	},

	input: {
		height: '46px',
		width: '722px',
		'&::-webkit-input-placeholder': {
			fontSize: '14px',
			color: '#93B0C1'
		}
	},

	inputError: {
		borderBottom: '2px solid #FE4B61 !important'
	},

	label: {
		color: '#93A4AF',
		fontSize: '12px',
		fontWeight: 'bold',
		lineHeight: '15px'
	}
});

class AddressBookAddContainer extends Component {
	state = {
		label: '',
		address: ''
	};

	componentDidMount() {
		this.props.dispatch(addressBookOperations.resetAdd());
	}

	handleSubmit = event => {
		event.preventDefault();
		return this.handleSave(this.state.label, this.state.address);
	};

	handleSave = async (label, address) => {
		await this.props.dispatch(addressBookOperations.addAddressBookEntry({ label, address }));
		this.closeAction();
	};

	handleLabelChange = event => {
		event.preventDefault();
		const label = event.target.value;
		this.setState({
			...this.state,
			label
		});
		this.props.dispatch(addressBookOperations.validateLabel(label));
	};

	handleAddressChange = event => {
		event.preventDefault();
		const address = event.target.value;
		this.setState({
			...this.state,
			address
		});
		this.props.dispatch(addressBookOperations.validateAddress(address));
	};

	closeAction = () => {
		this.props.dispatch(push('/main/addressBook'));
	};

	render() {
		const { classes, labelError, addressError } = this.props;
		const hasLabelError = labelError !== '' && labelError !== undefined;
		const hasAddressError = addressError !== '' && addressError !== undefined;
		const labelInputClass = `${classes.input} ${hasLabelError ? classes.errorColor : ''}`;
		const addressInputClass = `${classes.input} ${hasAddressError ? classes.errorColor : ''}`;

		return (
			<Modal open={true}>
				<ModalWrap>
					<ModalCloseButton onClick={this.closeAction}>
						<ModalCloseIcon style={{ marginTop: '20px' }} />
					</ModalCloseButton>
					<ModalHeader>
						<Grid container direction="row" justify="space-between" alignItems="center">
							<Grid item>
								<Typography variant="body1">Add Address</Typography>
							</Grid>
						</Grid>
					</ModalHeader>
					<ModalBody>
						<form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
							<Grid container direction="column" spacing={32}>
								<Grid item>
									<Grid container direction="column" spacing={8}>
										<Grid item>
											<label className={classes.label}>LABEL</label>
										</Grid>
										<Grid item>
											<Input
												type="text"
												id="labelInput"
												onChange={this.handleLabelChange}
												value={this.state.label}
												className={labelInputClass}
												placeholder="Address label"
											/>
											{hasLabelError && (
												<span id="labelError" className={classes.errorText}>
													{labelError}
												</span>
											)}
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Grid container direction="column" spacing={8}>
										<Grid item>
											<label className={classes.label}>ETH ADDRESS</label>
										</Grid>
										<Grid item>
											<Input
												type="text"
												id="addressInput"
												onChange={this.handleAddressChange}
												value={this.state.address}
												className={addressInputClass}
												placeholder="0x"
											/>
											{hasAddressError && (
												<span
													id="addressError"
													className={classes.errorText}
												>
													{addressError}
												</span>
											)}
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Grid container direction="row" spacing={24}>
										<Grid item>
											<StyledButton
												id="saveButton"
												variant="contained"
												size="large"
												type="submit"
												disabled={
													!this.state.label ||
													!this.state.address ||
													hasAddressError ||
													hasLabelError
												}
											>
												Save
											</StyledButton>
										</Grid>
										<Grid item>
											<StyledButton
												id="cancelButton"
												variant="outlined"
												size="large"
												onClick={this.closeAction}
											>
												Cancel
											</StyledButton>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</form>
					</ModalBody>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		labelError: addressBookSelectors.getLabelError(state),
		addressError: addressBookSelectors.getAddressError(state)
	};
};

const styledComponent = withStyles(styles)(AddressBookAddContainer);
export default connect(mapStateToProps)(styledComponent);
