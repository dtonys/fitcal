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
            {'The ultra intuitive scheduling app for any fitness business.'}
          </Typography>
        </div>
        <br /> <br />
        <Divider />
        <br /> <br />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <br /><br />
            <Typography type="title" color="primary" align="left" gutterBottom >
              {'Schedule pricing, payments, and all the rest.'}
            </Typography>
            <br />
            <Typography type="body1" color="primary" align="left" gutterBottom >
              {`Create a schedule and customize membership plans.
                We take care of everything in between for your studio to run smoothly.`}
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
              {'Get more signups'}
            </Typography>
            <br />
            <Typography type="body1" color="primary" align="left" gutterBottom >
              {`Our frictionless app lets clients signup easily
                for one-time, recurring, or multiple purchases!
                Use friendly client tools to keep track of their progress,
                set a curriculum, and celebrate their wins.`}
            </Typography>
          </Grid>
        </Grid>
        <br /> <br /> <br /> <br />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <br /><br />
            <Typography type="title" color="primary" align="left" gutterBottom >
              {'Optimize your schedule.'}
            </Typography>
            <br />
            <Typography type="body1" color="primary" align="left" gutterBottom >
              {`We provide schedule suggestions that help you easily manage and
                coordinate staff availabilities.  Create recurring sessions,
                appointment openings, and time-offs.`}
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
              {'Run reports and promos.'}
            </Typography>
            <br />
            <Typography type="body1" color="primary" align="left" gutterBottom >
              {`Know how you are doing MoM, YoY with our financial track tool.
                Set up promos and special deals for any occassion.`}
            </Typography>
          </Grid>
        </Grid>
        <br /> <br /> <br /> <br />
        <div className={ styles.headline } >
          <Typography type="title" color="primary" gutterBottom >
            {'One flat fee. Unlimited users.'}
          </Typography>
          <br /> <br />
          <Link to="/signup">
            <Button
              raised
              color="primary"
              type="submit"
            >
              Create Schedule
            </Button>
          </Link>
          <br /> <br /> <br /> <br />
        </div>
      </div>
    );
  }
}

export default HomePage;
