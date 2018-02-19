import React, { Component } from 'react';
import {
  dollars as normalizeDollars,
  number as normalizeNumber,
} from 'helpers/normalizers';
import {
  required as isRequired,
} from 'helpers/validators';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Typography from 'material-ui/Typography';
import styles from  'pages/Schedule/Schedule.scss';
import FormModal from 'components/FormModal/FormModal';
import TextInput from 'components/TextInput/TextInput';
import SelectInput from 'components/SelectInput/SelectInput';
import DateInput from 'components/DateInput/DateInput';


const _6AM_6PM = [ 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5 ];
const _sun_sat = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
const Calendar = () => (
  <div className={styles.schedule__wrap}>
    <div className={styles.hourAxis}>
      <div className={styles.hourUnit} > - </div>
      { _6AM_6PM.map((hour) => (
        <div key={hour} className={styles.hourUnit} style={{ paddingTop: '12px', paddingLeft: '5px' }} > {hour} </div>
      )) }
    </div>
    <Grid container>
      { _sun_sat.map((day) => (
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
);

export const NOT_RECURRING = 'NOT_RECURRING';
export const RECURRING_DAILY = 'RECURRING_DAILY';
export const RECURRING_WEEKLY = 'RECURRING_WEEKLY';

const commonProps = {
  margin: 'dense',
  fullWidth: true,
  style: { marginBottom: '10px' },
  validate: isRequired,
};
const textFieldProps = {
  component: TextInput,
  type: 'text',
  ...commonProps,
};
const dateFieldProps = {
  component: DateInput,
  type: 'text',
  ...commonProps,
};
const eventFields = [
  {
    name: 'name',
    ...textFieldProps,
  },
  {
    name: 'location',
    ...textFieldProps,
  },
  {
    name: 'start',
    ...dateFieldProps,
  },
  {
    name: 'end',
    ...dateFieldProps,
  },
  {
    component: SelectInput,
    name: 'repeats',
    options: [
      {
        value: NOT_RECURRING,
        label: 'Does not repeat',
      },
      {
        value: RECURRING_DAILY,
        label: 'Daily',
      },
      {
        value: RECURRING_WEEKLY,
        label: 'Weekly',
      },
    ],
    ...commonProps,
  },
  {
    name: 'capacity',
    parse: normalizeNumber,
    ...textFieldProps,
  },
  {
    component: SelectInput,
    name: 'payment',
    options: [
      {
        value: 'Free',
        label: 'Free',
      },
      {
        value: 'One Time Payment',
        label: 'One Time Payment',
      },
      {
        value: 'Requires Membership',
        label: 'Requires Membership',
      },
    ],
    ...commonProps,
  },
  {
    component: TextInput,
    name: 'price',
    type: 'text',
    parse: normalizeDollars,
    ...commonProps,
  },
];
const showMap = {
  price: ( values ) => ( Boolean( values.payment && values.payment !== 'Free' )),
};

class SchedulePage extends Component {

  constructor( props ) {
    super(props);
    this.state = {
      createModalOpen: false,
    };
  }

  openCreateModal = () => {
    this.setState({
      createModalOpen: true,
    });
  }

  closeCreateModal = () => {
    this.setState({
      createModalOpen: false,
    });
  }

  render() {
    const { createModalOpen } = this.state;

    return (
      <div>
        <Typography type="title" color="primary" gutterBottom >
          {'Actions'}
        </Typography>
        <Button
          className={styles.cta__button}
          raised
          color="primary"
          type="submit"
          data-test="submit"
          onClick={this.openCreateModal}
        >
          { 'Create event' }
        </Button>
        <FormModal
          open={createModalOpen}
          close={this.closeCreateModal}
          title="Create Event"
          fields={eventFields}
          showMap={showMap}
        />
        <br /><br />
        <Typography type="title" color="primary" gutterBottom >
          {'My Events'}
        </Typography>
        <br /><br />
        <Typography type="title" color="primary" gutterBottom >
          {'Joined Events'}
        </Typography>
      </div>
    );
  }
}
export default SchedulePage;
