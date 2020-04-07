import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import ContentAdd from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import HoverTable from "./HoverTable";

const axios = require('axios');

const TablePage = () => {
  const styles = {
    floatingActionButton: {
      margin: 0,
      top: "auto",
      right: 20,
      bottom: 20,
      left: "auto",
      position: "fixed"
    }
  };
  return (
    <div>
      <HoverTable />

      <Link to="/form">
        <Button mini={true} variant="fab" style={styles.floatingActionButton} color="secondary">
          <ContentAdd />
        </Button>
      </Link>
    </div>
  );
};

export default withStyles(null, { withTheme: true })(TablePage);
