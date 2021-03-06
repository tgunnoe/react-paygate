import React from "react";
import { Link, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import ContentCreate from "@material-ui/icons/Create";
import Fab from '@material-ui/core/Fab';
import ContentAdd from "@material-ui/icons/Add";
import DepositoryEdit from "./Edit.js";

import EnhancedTableHead from "./DataTables/EnhancedTableHead";
import EnhancedTableToolbar from "./DataTables/EnhancedTableToolbar";

const axios = require('axios');

const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
};

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class EnhancedTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "id",
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 10
  };
  styles = {
    floatingActionButton: {
      margin: 0,
      top: "auto",
      right: 20,
      bottom: 20,
      left: "auto",
      position: "fixed",
    }
  };
  async getData() {
    // Yeah this needs to come from an actual customer id
    const res = await axios.get(
      '/depositories',
      { headers: {'x-user-id': 'taylor'} });
    return await res.data;
  }
  componentDidMount() {
    if (this.state.data) {
      (async () => {
        try {
          this.setState({data: await this.getData()});
        } catch (e) {
          console.log(e);
          //Need better error handling
        }
      })();
    }
  }
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    return (
      <div>
        <Paper className={classes.root}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
                />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.id);
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                        >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        {}
                        <TableCell>{n.bankName} ({n.routingNumber})</TableCell>
                        <TableCell>{n.accountNumber}</TableCell>
                        <TableCell>{n.holder}</TableCell>
                        <TableCell>{n.holderType}</TableCell>
                        <TableCell>{n.metadata}</TableCell>
                        <TableCell>{n.status}</TableCell>
                        <TableCell>
                          <Link className="button" to={"/depositories/" + n.id}>
                            <Button mini={true} variant="fab" zDepth={0}>
                              <ContentCreate />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
        <TableRow>
        <TableCell colSpan={7} />
        </TableRow>
        </TableBody>
        </Table>
        </div>
        <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={data.length}
      rowsPerPage={rowsPerPage}
      page={page}
      backIconButtonProps={{
        "aria-label": "Previous Page"
      }}
      nextIconButtonProps={{
        "aria-label": "Next Page"
      }}
      onChangePage={this.handleChangePage}
      onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        </Paper>
        <Link to="/depositoriesadd">
        <Fab color="primary" aria-label="add" style={this.styles.floatingActionButton}>
        <ContentAdd />
        </Fab>
        </Link>

        </div>

    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
