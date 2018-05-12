import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { extractUserState } from 'redux/user/reducer';
import Link from 'redux-first-router-link';

import styles from 'pages/Home/Home.scss';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';


@connect(
  ( globalState ) => ({
    user: extractUserState(globalState).user,
  })
)
class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object,
  }
  static defaultProps = {
    user: null,
  }

  render() {
    return (
      <div className={ styles.wrap } >
        <div className={ styles.headline } >
          <Typography type="display1" color="primary" gutterBottom >
            {'The simplest way to manage your finess business'}
          </Typography>
        </div>
        <br /> <br />
        <Divider />
        <br /> <br />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <br /><br />
            <Typography type="title" color="primary" align="left" gutterBottom >
              {'Create memberships with ease'}
            </Typography>
            <br />
            <Typography type="body1" color="primary" align="left" gutterBottom >
              {`Create as many memberships as you want.
                You choose the price, location, and duration.
              `}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <img src="https://via.placeholder.com/200x200" />
          </Grid>
        </Grid>
        <br /> <br /> <br /> <br />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <img src="https://via.placeholder.com/200x200" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <br /><br />
            <Typography type="title" color="primary" align="left" gutterBottom >
              {'Setting up payment has never been simpler'}
            </Typography>
            <br />
            <Typography type="body1" color="primary" align="left" gutterBottom >
              {`Connect your bank account with Stripe to get paid.
                View your dashboard to see incoming payments and payouts.
                Get notified whenever a customer pays for a service.
              `}
            </Typography>
          </Grid>
        </Grid>
        <br /> <br /> <br /> <br />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <br /><br />
            <Typography type="title" color="primary" align="left" gutterBottom >
              {'Create events for your digital or physical business'}
            </Typography>
            <br />
            <Typography type="body1" color="primary" align="left" gutterBottom >
              {`We support entrepenuers with all types of businesses.
                Whether it's a one on one, group webinar, or meetup, our event system
                provides the flexibility to get you started in minutes.`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <img src="https://via.placeholder.com/200x200" />
          </Grid>
        </Grid>
        <br /> <br /> <br /> <br />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <img src="https://via.placeholder.com/200x200" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <br /><br />
            <Typography type="title" color="primary" align="left" gutterBottom >
              {'Risk free platform fee'}
            </Typography>
            <br />
            <Typography type="body1" color="primary" align="left" gutterBottom >
              {`
                We charge you a flat 10% fee for all money you earn on the platform.
                Pay nothing until you start making money.
                You can try out the platform without commitment or obligation.
              `}
            </Typography>
          </Grid>
        </Grid>
        <br /> <br /> <br /> <br />
        <div className={ styles.headline } >
          <Link to="/signup">
            <Button
              raised
              color="primary"
              type="submit"
            >
              Signup Today
            </Button>
          </Link>
          <br /> <br /> <br /> <br />
        </div>
      </div>
    );
  }
}

export default HomePage;
