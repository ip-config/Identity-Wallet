import React from 'react';

import { Grid, Button, withStyles, Typography } from '@material-ui/core';
import { H1 } from 'selfkey-ui';
import { MarketplaceServicesListItem } from './services-list-item';

const styles = theme => ({
	wrapper: {
		width: '1140px'
	},

	header: {
		borderBottom: 'solid 1px #475768',
		'& h1': {
			marginLeft: '20px'
		},
		'& svg': {
			marginLeft: '20px'
		},
		width: '100%',
		height: '120px'
	},

	headerContent: {
		marginTop: '50px'
	},

	content: { marginTop: '30px' },

	button: {
		color: '#93b0c1',
		borderColor: '#3b4a5a',
		'&:disabled': {
			color: '#48565f'
		}
	},

	bold: {
		fontWeight: 600
	},

	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	}
});

const getServices = (items, viewAction) => {
	return items.map(item => {
		return (
			<Grid item key={item.id || item.name} xs={4}>
				<MarketplaceServicesListItem
					id={item.id || item.name}
					name={item.name}
					description={item.description}
					status={item.status}
					logoUrl={item.logoUrl}
					viewAction={viewAction}
				/>
			</Grid>
		);
	});
};

export const MarketplaceServicesList = withStyles(styles)(
	({ classes, children, category, items, backAction, viewAction }) => (
		<Grid container>
			<Grid item>
				<div className={classes.backButtonContainer}>
					<Button variant="outlined" color="secondary" size="small" onClick={backAction}>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
			</Grid>
			<Grid item>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="center"
					className={classes.wrapper}
				>
					<Grid item id="header" className={classes.header} xs={12}>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							className={classes.headerContent}
						>
							<Grid item>{category.icon}</Grid>
							<Grid item>
								<H1>{category.title}</H1>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Grid
							container
							direction="row"
							justify="start"
							alignItems="center"
							spacing={24}
							className={classes.content}
						>
							{getServices(items, viewAction)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
);

export default MarketplaceServicesList;
