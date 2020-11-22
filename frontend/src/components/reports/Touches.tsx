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
import ReportProps from "../interfaces/props/report-props";
import { playerTouchDTO, touchesDTO } from "../interfaces/touches";
import { CircularProgress } from "@material-ui/core";
import { Button } from "react-bootstrap";

interface FormattedData {
  name: string;
  number: number;
  first: number;
  second: number;
  overall: number;
}

// Parse data in a consistent manner for display in table columns
function createData(
  first: string,
  last: string,
  jerseyNum: number,
  firstHalf: number,
  secondHalf: number,
  overall: number
): FormattedData {
  let name: string = first + " " + last;
  return {
    name: name,
    number: jerseyNum,
    first: firstHalf,
    second: secondHalf,
    overall: overall,
  };
}

export const hardCodedRows = [
  createData("Rob", "Park", 7, 12, 11, 23),
  createData("Jake", "Floyd", 1, 1, 0, 1),
  createData("Jim", "Floyd", 12, 18, 3, 21),
  createData("Sly", "Jackson", 6, 0, 0, 0),
  createData("Rod", "Nedson", 16, 1, 1, 2),
  createData("Fin", "Clarkson", 13, 3, 3, 6),
  createData("Tanner", "Greggel", 11, 2, 30, 32),
  createData("Shirl", "Benter", 24, 11, 24, 35),
  createData("Becky", "Clarke", 31, 5, 4, 9),
  createData("Steph", "Sampson", 26, 5, 8, 13),
  createData("Jenn", "Winston", 23, 18, 4, 24),
  createData("Bruce", "Banner", 28, 16, 4, 20),
  createData("Greyson", "Grey", 18, 12, 5, 17),
  createData("Herman", "Blake", 19, 12, 5, 17),
];

function formatData(data: touchesDTO): FormattedData[] {
  let formatted: FormattedData[] = [];
  for (let i = 0; i < data.firstHalfTouches.length; i++) {
    let firstPlayerAndTouches: playerTouchDTO = data.firstHalfTouches[i];
    // If the player represents their team, then ignore
    if (!firstPlayerAndTouches.player) continue;
    let secondPlayerAndTouches: playerTouchDTO = data.secondHalfTouches[i];
    let overallPlayerAndTouches: playerTouchDTO = data.fullGameTouches[i];
    let player = firstPlayerAndTouches.player;
    // Add to list of formatted data
    formatted.push(
      createData(
        player.firstName,
        player.lastName,
        player.jerseyNum,
        firstPlayerAndTouches.touches,
        secondPlayerAndTouches.touches,
        overallPlayerAndTouches.touches
      )
    );
  }
  return formatted;
}

// Enable using a hardcoded set of values for testing or to use data from an api call
export async function fetchTouchesRows(
  matchId: number,
  debug = false
): Promise<FormattedData[]> {
  if (debug) {
    // Return hardcoded values
    return hardCodedRows;
  }

  try {
    const res = await axios.get(`/player-stats/touches?matchId=${matchId}`, {
      headers: authHeader(),
    });
    let resData: touchesDTO = res.data;
    console.log("Get touches response:", resData);

    return formatData(resData);
  } catch (error) {
    return [];
  }
}

function validateTouches(rows: FormattedData[]): boolean {
  // No returned touches info
  if (!rows || rows.length == 0) return false;

  // Validate each record
  for (let i = 0; i < rows.length; i++) {
    // Optimistically handle invalid rows by removing improper rows but continuing
    if (
      !rows[i].name || // ie. empty string ''
      !rows[i].number || // ie. 0
      rows[i].number < 0 || // too small
      rows[i].number > 100 || // too large
      rows[i].first < 0 || // invalid
      rows[i].first > 1000 || // too large
      rows[i].second < 0 || // invalid
      rows[i].second > 1000 || // too large
      rows[i].overall < 0 || // invalid
      rows[i].overall > 2000 || // too large
      rows[i].first + rows[i].second !== rows[i].overall // incorrect total
    )
      rows.splice(i, 1); // Remove this offending row
  }

  // If after optimistic handling of issue rows, our array is empty
  if (rows.length == 0) return false;

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
    id: "first",
    numeric: true,
    disablePadding: false,
    label: "First Half Touches",
  },
  {
    id: "second",
    numeric: true,
    disablePadding: false,
    label: "Second Half Touches",
  },
  {
    id: "overall",
    numeric: true,
    disablePadding: false,
    label: "Overall Touches",
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
        Number of Touches
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

type TouchesTableProps = {
  fetchTouches: Function; // Dependency inject for testing
};

export default function TouchesTable(props: TouchesTableProps & ReportProps) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof FormattedData>("overall");
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
        setRows(await props.fetchTouches(props.matchId));
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
  if (rows == null) return <CircularProgress />;
  if (!validateTouches(rows))
    return (
      <Button variant="warning" onClick={reloadOnClick}>
        {" "}
        Something Went Wrong... Click To Reload
      </Button>
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
                      <TableCell align="right">{row.first}</TableCell>
                      <TableCell align="right">{row.second}</TableCell>
                      <TableCell align="right">{row.overall}</TableCell>
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
