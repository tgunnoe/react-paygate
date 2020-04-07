import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { grey } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import PageBase from "../../components/PageBase";
import Asynchronous from "./AsyncOrig";
import Autocomplete from '@material-ui/lab/Autocomplete';

const axios = require('axios');
const transX = 14;
const transY = -6;
const scale = 0.75;
const styles = {
  toggleDiv: {
    marginTop: 20,
    marginBottom: 5
  },
  toggleLabel: {
    color: grey[400],
    fontWeight: 100
  },
  buttons: {
    marginTop: 30,
    float: "right"
  },
  saveButton: {
    marginLeft: 5
  },
  formElement: {
    marginTop: 20,
    minWidth: 200,
    display: 'block'
  },
  divider: {
    marginTop: 40,
    marginBottom: 40
  },
  fixLabel: {
    backgroundColor: 'white',
    transform: 'translate(${transX}px, ${transY}px) scale(${scale})'
  },
  formControl: {
    minWidth: 200
  }
};

class TransferForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '0.00',
      transferType: 'pull',
      originator: '',
      originatorDepository: '',
      receiver: '',
      receiverDepository: '',
      description: '',
      secCode: 'WEB',
      sameDay: true,
      paymentInfo: '',
      paymentType: 'single'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOriginator = this.handleOriginator.bind(this);
    this.handleReceiver = this.handleReceiver.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }
  handleSubmit(event){
    event.preventDefault();
    console.log(this.state);
    axios({
      method: 'post',
      url: '/transfers',
      data: {
        transferType: this.state.transferType,
        amount: 'USD ' + this.state.amount,
        originator: this.state.originator,
        originatorDepository: this.state.originatorDepository,
        receiver: this.state.receiver,
        receiverDepository: this.state.receiverDepository,
        description: this.state.description,
        standardEntryClassCode: this.state.secCode,
        sameDay: this.state.sameDay,
        WEBDetail: {
          paymentInformation: this.state.paymentInfo,
          paymentType: this.state.paymentType
        }
      },
      headers: {'x-user-id': 'taylor'}
    })
      .then(function(response) {
        console.log(response);
         window.location = "/transfers"
      });
  }
  handleSelectChange(event, value) {
    console.log(value);
    this.setState({[value.state]: value.value});
  }
  handleInputChange(event) {

    const target = event.target;
    const value = target.name === 'sameDay' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
    if(target.name === 'originator')
      this.setState({originatorDepository: event.currentTarget.dataset.depository});
    else if(target.name === 'receiver')
      this.setState({receiverDepository: event.currentTarget.dataset.depository});

  }
  handleOriginator( event, value ){
    this.setState({
      originator: value.id,
      originatorDepository: value.defaultDepository
    });
  }
  handleReceiver( event, value ){
    this.setState({
      receiver: value.id,
      receiverDepository: value.defaultDepository
    });
  }
  render() {

    return (
      <PageBase title="Create Transfer" navigation="Transfers / Create">

        <form onSubmit={this.handleSubmit}>

          <TextField
            hintText="Amount"
            label="Amount"
            name="amount"
            fullWidth={false}
            margin="normal"
            style={{ width: 300 }}
            defaultValue={this.state.amount}
            onChange={this.handleInputChange}
            variant="outlined"
            />

          <FormControl fullWidth={true} style={styles.formElement}>
            <Autocomplete
              id="transfer-type"
              options={[
                {name: "Credit", state: "transferType", value: "push"},
                {name: "Debit", state: "transferType", value: "pull"}
              ]}
              onChange={this.handleSelectChange}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.value === value.value}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Transfer Type" variant="outlined" />}
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <Asynchronous
              onChange={this.handleOriginator}
              url="/originators"
              id="originators-selector"
              label="Select an originator..."
              variant="outlined"
              width={400}
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <Asynchronous
              onChange={this.handleReceiver}
              url="/receivers"
              id="receivers-selector"
              label="Select a receiver...."
              variant="outlined"
              width={400}
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <TextField
              hintText="Description"
              label="Description"
              style={{ width: 500}}
              inputProps={{
                name: "description",
                id: "description"
              }}
              fullWidth={true}
              margin="normal"
              variant="outlined"
              onChange={this.handleInputChange}
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <Autocomplete
              id="sec-code"
              options={[
                {name: "WEB", state: "secCode", value: "WEB"}
              ]}
              onChange={this.handleSelectChange}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.value === value.value}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Standard Entry Class Code" variant="outlined" />}
              />
          </FormControl>

          <div style={styles.toggleDiv}>

            <FormControlLabel control={<Switch onChange={this.handleInputChange} />} label="Same Day preferred?" />

          </div>

          <TextField
            hintText="Payment Information"
            label="Payment Information"
            fullWidth={false}
            style={{ width: 500}}
            margin="normal"
            variant="outlined"
            inputProps={{
              name: "paymentInfo",
              id: "payment-info"
            }}
            onChange={this.handleInputChange}
            />

          <FormControl fullWidth={true} style={styles.formElement}>
            <Autocomplete
              id="payment-type"
              options={[
                {name: "Single", state: "paymentType", value: "single"},
                {name: "Reoccuring", state: "paymentType", value: "reoccuring"}
              ]}
              onChange={this.handleSelectChange}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.value === value.value}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Payment Type" variant="outlined" />}
              />
          </FormControl>

          <Divider style={styles.divider} />

          <div style={styles.buttons}>
            <Link to="/transfers">
              <Button variant="contained">Cancel</Button>
            </Link>

            <Button
              style={styles.saveButton}
              variant="contained"
              type="submit"
              color="primary"
              >
              Save
            </Button>
          </div>
        </form>
      </PageBase>
  );
    }
};

export default TransferForm;
