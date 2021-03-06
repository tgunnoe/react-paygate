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
import PageBase from "../components/PageBase";
import Asynchronous from "./AsyncSettings";

import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const axios = require('axios');
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const styles = theme => ({
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
  divider: {
    marginTop: 80,
    marginBottom: 80
  },
  saveButton: {
    marginLeft: 5
  },
  formElement: {
    marginTop: 20,
    minWidth: 200,
    display: 'block'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  }
});

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timezone: 'America/New_York',
      cutoff: 1700,
      depository: '',
      inboundPath: 'inbound/',
      outboundPath: 'outbound/',
      returnPath: 'returned/',
      outboundFilenameTemplate: '',
      AllowedIPs: '',
      hostname: 'localhost:2121',
      username: 'admin',
      password: '123456',

    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDepository = this.handleDepository.bind(this);
  }
  handleSubmit(event){
    event.preventDefault();

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
      });
  }

  handleInputChange(event) {
    console.log(this.state);
    const target = event.target;
    const value = target.name === 'sameDay' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value    });
    if(target.name === 'originator')
      this.setState({originatorDepository: event.currentTarget.dataset.depository});
    if(target.name === 'receiver')
      this.setState({receiverDepository: event.currentTarget.dataset.depository});

  }
  handleDepository( event, value ){
    this.setState({
      defaultDepository: value.id,
    });
  }
  render() {
    //const classes = useStyles();
    var depositories = [];
    axios.get(
      '/depositories',
      {
        headers: {'x-user-id': 'taylor'}
      }).then(res => {
        //console.log(res.data);
        res.data.forEach(function(i, index){
          depositories.push(<MenuItem value={i.routingNumber}>{i.holder + ' (' + i.bankName + ' accout ' + i.accountNumber + ')'}</MenuItem>);
        });
      });

    return (
      <PageBase title="Settings" navigation="Settings">

        <FormControl fullWidth={true} style={styles.formElement} margin="normal">
          <Asynchronous
            onChange={this.handleDepository}
            url="/depositories"
            id="depositories-selector"
            label="Select a depository..."
            variant="outlined"
            width={400}
            />
        </FormControl>

        <Divider style={{marginTop: 10, marginBottom: 10}} />

        <form onSubmit={this.handleSubmit}>
          <TextField
            hintText="Timezone"
            label="Timezone"
            name="timezone"
            fullWidth={false}
            margin="normal"
            variant="outlined"
            style={{ width: 400}}
            defaultValue={this.state.timezone}
            onChange={this.handleInputChange}
            />

          <FormControl fullWidth={true} style={styles.formElement} margin="normal">
            <TextField
              id="time"
              label="Cutoff Time"
              type="time"
              defaultValue="05:00"
              variant="outlined"
              style={{ width: 200}}

              //className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              />
          </FormControl>
          <FormControl fullWidth={true} style={styles.formElement} margin="normal">
            <TextField
              hintText="Inbound ACH path"
              label="Inbound ACH Path"
              name="inboundPath"
              fullWidth={true}
              margin="normal"
              variant="outlined"
              style={{ width: 400}}
              defaultValue={this.state.inboundPath}
              onChange={this.handleInputChange}
              />
          </FormControl>
          <FormControl fullWidth={true} style={styles.formElement} margin="normal">
            <TextField
              hintText="Outbound ACH path"
              label="Outbound ACH Path"
              name="outboundPath"
              fullWidth={true}
              margin="normal"
              variant="outlined"
              style={{ width: 400}}
              defaultValue={this.state.outboundPath}
              onChange={this.handleInputChange}
              />
          </FormControl>
          <FormControl fullWidth={true} style={styles.formElement} margin="normal">
            <TextField
              hintText="Returned ACH path"
              label="Returned ACH Path"
              name="returnPath"
              fullWidth={true}
              margin="normal"
              variant="outlined"
              style={{ width: 400}}
              defaultValue={this.state.returnPath}
              onChange={this.handleInputChange}
              />
          </FormControl>
          <FormControl fullWidth={true} style={styles.formElement} margin="normal">
            <TextField
              hintText="Hostname"
              label="Hostname:port"
              inputProps={{
                name: "hostname",
                id: "hostnamee"
              }}
              fullWidth={true}
              margin="normal"
              variant="outlined"
              style={{ width: 400}}
              defaultValue={this.state.hostname}
              onChange={this.handleInputChange}
              />
          </FormControl>
          <FormControl fullWidth={true} style={styles.formElement} margin="normal">
            <TextField
              hintText="Username"
              label="Username"
              inputProps={{
                name: "username",
                id: "username"
              }}
              fullWidth={true}
              margin="normal"
              variant="outlined"
              style={{ width: 400}}
              defaultValue={this.state.username}
              onChange={this.handleInputChange}
              />
          </FormControl>
          <FormControl fullWidth={true} style={styles.formElement} margin="normal">
            <TextField
              hintText="Password"
              label="Password"
              inputProps={{
                name: "password",
                id: "password"
              }}
              fullWidth={true}
              margin="normal"
              variant="outlined"
              style={{ width: 400}}
              type="password"
              defaultValue={this.state.password}
              onChange={this.handleInputChange}
              />
          </FormControl>
          <br />
          <br />
          <Divider />
          <br />
          <br />
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

export default Settings;
