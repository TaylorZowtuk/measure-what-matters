import React, { useEffect, useState } from "react";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import authHeader from "../../services/auth.header";
import { timeOnFieldDTO } from "../interfaces/timeOnField";
import ReportProps from "../interfaces/props/report-props";
import { CircularProgress } from "@material-ui/core";
import { Button } from "react-bootstrap";
import round from "lodash/round";
import RefreshIcon from "@material-ui/icons/Refresh";

interface FormattedData {
  name: string;
  number: number;
  minutes: number;
}

// Parse data in a consistent manner for display in table columns
export function createData(
  first: string,
  last: string,
  number: number,
  milliseconds: number
) {
  let name: string = first + " " + last;
  let minutes = round(milliseconds / (60 * 1000), 1);
  return { name, number, minutes };
}

// Enable using a hardcoded set of values for testing or to use data from an api call
export async function fetchTimeOnFieldRows(
  matchId: number
): Promise<FormattedData[]> {
  try {
    const res = await axios.get(
      `/player-stats/timeOnField?matchId=${matchId}`,
      {
        headers: authHeader(),
      }
    );

    console.log("Time on field response:", res.data); // Handle errors
    let rows: FormattedData[] = [];
    for (let i = 0; i < res.data.length; i++) {
      let player: timeOnFieldDTO = res.data[i];
      rows.push(
        createData(
          player.firstName,
          player.lastName,
          player.jerseyNum,
          player.millisecondsPlayed
        )
      );
    }
    return rows;
  } catch (error) {
    return [];
  }
}

function validateRows(rows: FormattedData[]): boolean {
  // No returned time on field info
  if (!rows || rows.length === 0) return false;

  // Validate each record
  let i: number = rows.length;
  while (i--) {
    // Optimistically handle invalid rows by removing improper rows but continuing
    if (
      !rows[i].name || // ie. empty string ''
      rows[i].name === " " || // ie. empty string ' '
      !rows[i].number || // ie. 0
      rows[i].number < 0 || // too small
      rows[i].number > 100 || // too large
      rows[i].minutes < 0 || // invalid
      rows[i].minutes > 540 // too large; no game should be longer than 3 hours
    ) {
      rows.splice(i, 1); // Remove this offending row
    }
  }

  // If after optimistic handling of issue rows, our array is empty
  if (rows.length === 0) return false;

  // Was valid
  return true;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof FormattedData;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Player Name",
  },
  {
    id: "number",
    numeric: true,
    disablePadding: true,
    label: "Player Number",
  },
  {
    id: "minutes",
    numeric: true,
    disablePadding: false,
    label: "Minutes Played",
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof FormattedData
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof FormattedData) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  })
);

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();
  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Time on Field
      </Typography>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 550,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

type TimeOnFieldTableProps = {
  fetchTimeOnField: Function; // Dependency inject for testing
};

export default function EnhancedTable(
  props: TimeOnFieldTableProps & ReportProps
) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof FormattedData>("minutes");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // State for allowing user to reload component
  const [reload, setReload] = useState(0);
  const reloadOnClick = () => {
    setReload(reload + 1);
  };

  const [rows, setRows] = useState<FormattedData[] | null>(null);
  useEffect(() => {
    async function getRows() {
      if (props.matchId) {
        setRows(await props.fetchTimeOnField(props.matchId));
      }
    }
    getRows();
  }, [props, reload]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof FormattedData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // If no match is selected on the dashboard, display nothing
  if (!props.matchId) return null;
  // If we havent completed the asynchronous data fetch yet; return a loading indicator
  if (rows == null) return <CircularProgress data-testid="loading_indicator" />;
  if (!validateRows(rows))
    return (
      <div>
        <Button variant="danger" onClick={reloadOnClick}>
          Couldn't Load Report <RefreshIcon />
        </Button>
      </div>
    );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.name}>
                      <TableCell component="th" scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.number}</TableCell>
                      <TableCell align="right">{row.minutes}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
