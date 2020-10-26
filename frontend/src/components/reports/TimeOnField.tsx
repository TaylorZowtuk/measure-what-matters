import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 50,
  },
});

function createData(
  first: string,
  last: string,
  number: number,
  seconds: number
) {
  let name_num: string = first + " " + last;
  let minutes = Math.floor(seconds / 60);
  return { name_num, number, minutes };
}

const rows = [
  createData("Rob", "Park", 7, 125),
  createData("Jake", "Floyd", 1, 1256),
  createData("Jim", "Floyd", 12, 1678),
  createData("Sly", "Jackson", 6, 1256),
  createData("Rod", "Nedson", 16, 563),
  createData("Fin", "Clarkson", 13, 346),
  createData("Tanner", "Greggel", 11, 256),
  createData("Shirl", "Benter", 24, 0),
  createData("Becky", "Clarke", 31, 547),
  createData("Steph", "Sampson", 26, 586),
  createData("Jenn", "Winston", 23, 868),
  createData("Bruce", "Banner", 28, 1646),
  createData("Greyson", "Grey", 18, 1256),
  createData("Herman", "Blake", 19, 2356),
];

function getRows(debug = true) {
  if (debug) {
    return rows;
  }
  return rows;
}

export default function TimeOnField() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="Time on Field Report">
        <TableHead>
          <TableRow>
            <TableCell>Player Name / #</TableCell>
            <TableCell align="left">Player #</TableCell>
            <TableCell align="right">Minutes Played</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getRows().map((row) => (
            <TableRow key={row.name_num}>
              <TableCell component="th" scope="row">
                {row.name_num}
              </TableCell>
              <TableCell align="left">{row.number}</TableCell>
              <TableCell align="right">{row.minutes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
