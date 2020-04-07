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
import Asynchronous from "./AsyncDep";

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
class OriginatorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      identification: '',
      defaultDepository: '',
      metadata: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOriginator = this.handleOriginator.bind(this);
    this.handleReceiver = this.handleReceiver.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleDepository = this.handleDepository.bind(this);
  }
  handleSubmit(event){
    event.preventDefault();
    console.log(this.state);
    axios({
      method: 'patch',
      url: '/originators/' + this.state.id,
      data: {
        identification: this.state.identification,
        defaultDepository: this.state.defaultDepository,
        metadata: this.state.metadata
      },
      headers: {'x-user-id': 'taylor'}
    })
      .then(function(response) {
        console.log(response);
         window.location = "/originators"
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
  handleDepository( event, value ){
    console.log(value);
    this.setState({
      defaultDepository: value.id,
    });
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
      '/originators/' + this.state.id,
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
      <PageBase title="Edit Originator" navigation="Originators / Edit">

        <form onSubmit={this.handleSubmit}>

                <FormControl fullWidth={true} style={styles.formElement}>
            <TextField
              hintText="Identification"
              label="Identification"
              name="identification"
              fullWidth={false}
              margin="normal"
              style={{ width: 500 }}
      defaultValue={this.state.identification}
      value={this.state.identification}
              onChange={this.handleInputChange}
              variant="outlined"
              />
          </FormControl>

          <FormControl fullWidth={true} style={styles.formElement}>
            <Asynchronous
              onChange={this.handleDepository}
              url="/depositories"
              id="depositories-selector"
              label="Select a depository..."
              variant="outlined"
              width={400}
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
      value={this.state.metadata}
              margin="normal"
              variant="outlined"
              onChange={this.handleInputChange}
              />
          </FormControl>

        <Divider style={styles.divider} />

          <div style={styles.buttons}>
            <Link to="/originators">
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

export default OriginatorEdit;
