import React from 'react';
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

const axios = require('axios');


const AsyncOriginators = props => {

  const { onChange, url, headers, id, label, variant, width, ...other } = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await axios.get( url, { headers: {'x-user-id': 'taylor'}} );
      const respOptions = await response.data;

      if (active) {
        setOptions(respOptions);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id={id}
      style={{ width: width || 400 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.identification || option.metadata}
      options={options}
      loading={loading}
      onChange={onChange}
      {...other}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant={variant}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

AsyncOriginators.propTypes = {
  onChange: PropTypes.func,
  url: PropTypes.string,
  headers: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.string,
  width: PropTypes.number
};

export default AsyncOriginators;
