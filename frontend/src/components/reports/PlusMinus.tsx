import React, { useEffect } from "react";
import PlusMinus from "../interfaces/plusMinus";
import axios from "axios";
import authHeader from "../../services/auth.header";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Typography,
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core";
import ReportProps from "../interfaces/props/report-props";

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
        Plus Minus
      </Typography>
    </Toolbar>
  );
};

async function fetchPlusMinus(matchId: number): Promise<PlusMinus[]> {
  const response = await axios.get(
    `/player-stats/plus-minus?matchId=${matchId}`,
    {
      headers: authHeader(),
    }
  );
  return response.data;
}

export default function PlusMinusComponent(props: ReportProps) {
  const [plusMinus, setPlusMinus] = React.useState<PlusMinus[] | null>(null);

  useEffect(() => {
    async function getPlusMinus() {
      if (props.matchId) {
        setPlusMinus(await fetchPlusMinus(props.matchId));
      }
    }
    getPlusMinus();
  }, [props]);

  if (!plusMinus || !props.matchId) {
    return (
      <div className="PlusMinus">
        <TableContainer component={Paper}>
          <EnhancedTableToolbar />
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell align="center">Jersey Number</TableCell>
                <TableCell align="center">Plus Minus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    return (
      <div className="PlusMinus">
        <TableContainer component={Paper}>
          <EnhancedTableToolbar />
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell align="center">Jersey Number</TableCell>
                <TableCell align="center">Plus Minus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plusMinus.map((plusMinus) => (
                <TableRow key={plusMinus.player.playerId}>
                  <TableCell>{plusMinus.player.firstName}</TableCell>
                  <TableCell>{plusMinus.player.lastName}</TableCell>
                  <TableCell align="center">
                    {plusMinus.player.jerseyNum}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      backgroundColor:
                        plusMinus.plusMinus <= 0
                          ? plusMinus.plusMinus === 0
                            ? "white"
                            : "red"
                          : "green",
                      color: plusMinus.plusMinus !== 0 ? "white" : "black",
                    }}
                  >
                    {plusMinus.plusMinus}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
