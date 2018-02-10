import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import styles from  'pages/TrainerSchedule/TrainerSchedule.scss';


class TrainerSchedulePage extends Component {
  render() {
    const _6AM_6PM = [ 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5 ];
    const _Sun_Sat = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
    return (
      <div>
        <div> Actions: </div>
        <br />
        <Button
          className={styles.cta__button}
          raised
          color="primary"
          type="submit"
          data-test="submit"
          onClick={this.btnClick}
        >
          { 'Connect Stripe Account' }
        </Button>
        <Button
          className={styles.cta__button}
          raised
          color="primary"
          type="submit"
          data-test="submit"
          onClick={this.btnClick}
        >
          { 'Create membership' }
        </Button>
        <Button
          className={styles.cta__button}
          raised
          color="primary"
          type="submit"
          data-test="submit"
          onClick={this.btnClick}
        >
          { 'Create event' }
        </Button>
        <br /> <br />
        <div> Memberships: </div>
        <br /><br />
        <div>
          <div> My Schedule </div>
          <div className={styles.schedule__wrap}>
            <div className={styles.hourAxis}>
              <div className={styles.hourUnit} > - </div>
              { _6AM_6PM.map((hour) => (
                <div key={hour} className={styles.hourUnit} style={{ paddingTop: '12px', paddingLeft: '5px' }} > {hour} </div>
              )) }
            </div>
            <Grid container>
              { _Sun_Sat.map((day) => (
                <Grid key={day} item xs >
                  <div className={styles.hourUnit} >{day}</div>
                  { _6AM_6PM.map((hour) => (
                    <div key={day + hour} className={styles.hourUnit} >
                      <Button
                        variant="fab"
                        fullWidth
                        color="primary"
                        style={{ height: '100%' }}
                      >
                        <AddIcon />
                      </Button>
                    </div>
                  )) }
                </Grid>
              )) }
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
export default TrainerSchedulePage;
