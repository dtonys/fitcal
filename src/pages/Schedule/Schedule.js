import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import lodashFind from 'lodash/find';
import moment from 'moment';
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
import EventList from 'components/EventList/EventList';
import {
  CREATE_EVENT_REQUESTED,
  DELETE_EVENT_REQUESTED,
  UPDATE_EVENT_REQUESTED,
  LOAD_EVENT_LIST_REQUESTED,
} from 'redux/event/actions';
import {
  extractListState,
} from 'redux/event/reducer';


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
    ],
    ...commonProps,
  },
  {
    component: TextInput,
    name: 'price_dollars',
    label: 'price',
    type: 'text',
    parse: normalizeNumber,
    format: normalizeDollars,
    ...commonProps,
  },
];
// Conditionally show these fields
const showMap = {
  price_dollars: ( values ) => ( Boolean( values.payment && values.payment !== 'Free' )),
};
const convertFormValuesToApiFormat = ( values ) => {
  const apiValues = {
    ...values,
  };

  // convert dollars to cents
  [
    [ 'price_dollars', 'price_cents' ],
  ].forEach(( pair ) => {
    const [ dollarsKey, centsKey ] = pair;
    apiValues[centsKey] = ( values[dollarsKey]
      ? values[dollarsKey] + '00'
      : '0'
    );
    delete apiValues[dollarsKey];
  });

  // serialize date to ISO format, for the API
  [ 'start', 'end' ].forEach(( dateField ) => {
    apiValues[dateField] = values[dateField].toISOString();
  });
  return apiValues;
};
const convertApiValuesToFormFormat = ( eventItem ) => {
  const formValues = {
    name: eventItem.name,
    location: eventItem.location,
    start: moment(eventItem.start_date),
    end: moment(eventItem.end_date),
    repeats: eventItem.recurring_type,
    capacity: eventItem.max_clients.toString(),
  };
  if ( eventItem.price_cents === 0 ) {
    formValues.payment = 'Free';
    formValues.price_dollars = '0';
  }
  if ( eventItem.price_cents >= 100 ) {
    formValues.payment = 'One Time Payment';
    formValues.price_dollars = (eventItem.price_cents / 100).toString();
  }
  return formValues;
};

@connect(
  ( globalState ) => ({
    eventList: extractListState(globalState).items,
  })
)
class SchedulePage extends Component {
  static propTypes = {
    eventList: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor( props ) {
    super(props);
    this.state = {
      modalOpen: false,
      modalActionType: CREATE_EVENT_REQUESTED,
      modalTitle: 'Create Event',
      initialValues: null,
    };
  }

  // NOTE: Load on server for real use case
  componentDidMount() {
    this.props.dispatch({
      type: LOAD_EVENT_LIST_REQUESTED,
      meta: { apiUrl: '/api/events' },
    });
  }

  openEditModal = ( event ) => {
    const id = event.currentTarget.getAttribute('data-resource-id');
    const eventItem = lodashFind(this.props.eventList, { _id: id }, null);

    const initialFormValues = convertApiValuesToFormFormat(eventItem);
    initialFormValues.id = id;

    this.setState({
      modalOpen: true,
      modalActionType: UPDATE_EVENT_REQUESTED,
      modalTitle: 'Edit Event',
      initialValues: initialFormValues,
    });
  }

  confirmDelete = ( event ) => {
    const id = event.currentTarget.getAttribute('data-resource-id');
    const result = confirm('Are you sure you want to delete this item?'); // eslint-disable-line no-alert
    if ( result ) {
      this.props.dispatch({ type: DELETE_EVENT_REQUESTED, payload: id });
    }
  }

  openCreateModal = () => {
    this.setState({
      modalOpen: true,
      modalActionType: CREATE_EVENT_REQUESTED,
      modalTitle: 'Create Event',
      initialValues: null,
    });
  }

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  }

  render() {
    const {
      eventList,
    } = this.props;

    const {
      modalOpen,
      modalActionType,
      modalTitle,
      initialValues,
    } = this.state;

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
          open={modalOpen}
          close={this.closeModal}
          submitActionType={modalActionType}
          title={modalTitle}
          fields={eventFields}
          showMap={showMap}
          convertFormValuesToApiFormat={convertFormValuesToApiFormat}
          initialValues={initialValues}
        />
        <br /><br />
        <Typography type="title" color="primary" gutterBottom >
          {'My Events'}
        </Typography>
        <EventList
          onEditClick={this.openEditModal}
          onDeleteClick={this.confirmDelete}
          eventList={eventList}
        />
        <br /><br />
        <Typography type="title" color="primary" gutterBottom >
          {'Joined Events'}
        </Typography>
      </div>
    );
  }
}
export default SchedulePage;
