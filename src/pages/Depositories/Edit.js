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
class DepositoryEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      bankName: '',
      holder: '',
      holderType: '',
      type: '',
      routingNumber: '',
      accountNumber: '',
      metadata: ''
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
      method: 'patch',
      url: '/depositories/' + this.state.id,
      data: {
        bankName: this.state.bankName,
        holder: this.state.holder,
        holderType: this.state.holderType,
        type: this.state.type,
        routingNumber: this.state.routingNumber,
        accountNumber: this.state.accountNumber,
        metadata: this.state.metadata
      },
      headers: {'x-user-id': 'taylor'}
    })
      .then(function(response) {
        console.log(response);
         window.location = "/depositories"
      });
  }
  handleSelectChange(event, value) {
    if(value)
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
  async getData() {
    // Yeah this needs to come from an actual customer id
    const res = await axios.get(
      '/depositories/' + this.state.id,
      { headers: {'x-user-id': 'taylor'} });
    return await res.data;
  }
  componentDidMount(){
    if (this.state.id) {
      (async () => {
        try {
          this.setState(
            await this.getData()
          );
        } catch (e) {
          console.log(e);
          //Need better error handling
        }
      })();
    }
  }
  render() {

    return (
      <PageBase title="Edit Depository" navigation="Depositories / Edit">

        <form onSubmit={this.handleSubmit}>
          <FormControl fullWidth={true} style={styles.formElement}>
          <TextField
            hintText="Bank Name"
            label="Bank Name"
            name="bankName"
            fullWidth={false}
            margin="normal"
            style={{ width: 500 }}
            defaultValue={this.state.bankName}
            value={this.state.bankName}
            onChange={this.handleInputChange}
            variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth={true} style={styles.formElement}>
          <TextField
            hintText="Holder"
            label="Account Holder"
            name="holder"
            fullWidth={false}
            margin="normal"
            style={{ width: 500 }}
            defaultValue={this.state.holder}
            value={this.state.holder}
            onChange={this.handleInputChange}
            variant="outlined"
            />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <Autocomplete
              id="holder-type"
              options={[
                {name: "individual", state: "holderType", value: "individual"},
                {name: "business", state: "holderType", value: "business"}
              ]}
              onChange={this.handleSelectChange}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.value === value.value}
              value={{name: this.state.holderType, state: "holderType", value: this.state.holderType}}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Holder Type" variant="outlined" />}
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <Autocomplete
              id="account-type"
              options={[
                {name: "checking", state: "type", value: "checking"},
                {name: "savings", state: "type", value: "savings"}
              ]}
              onChange={this.handleSelectChange}
              getOptionLabel={(option) => option.name}
              value={{name: this.state.type, state: "type", value: this.state.type}}
              getOptionSelected={(option, value) => option.value === value.value}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Account Type" variant="outlined" />}
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <TextField
              hintText="Routing Number"
              label="Routing Number"
              style={{ width: 300}}
              inputProps={{
                name: "routingNumber",
                id: "routing-number"
              }}
              fullWidth={true}
              margin="normal"
              variant="outlined"
              value={this.state.routingNumber}
              onChange={this.handleInputChange}
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <TextField
              hintText="Account Number"
              label="Account Number"
              style={{ width: 300}}
              inputProps={{
                name: "accountNumber",
                id: "account-number"
              }}
              fullWidth={true}
              margin="normal"
              variant="outlined"
              value={this.state.accountNumber}
              onChange={this.handleInputChange}
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <TextField
              hintText="Metadata"
              label="Metadata"
              style={{ width: 500}}
              inputProps={{
                name: "metadata",
                id: "metadata"
              }}
              fullWidth={true}
              margin="normal"
              variant="outlined"
              value={this.state.metadata}
              onChange={this.handleInputChange}
              />
          </FormControl>

          <Divider style={styles.divider} />

          <div style={styles.buttons}>
            <Link to="/depositories">
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

export default DepositoryEdit;
