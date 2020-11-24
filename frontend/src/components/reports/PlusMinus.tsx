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
  CircularProgress,
} from "@material-ui/core";
import ReportProps from "../interfaces/props/report-props";
import CSS from "csstype";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Button } from "react-bootstrap";

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

const tableStyling: CSS.Properties = {
  height: "50vh",
  width: "30vw",
  margin: "auto",
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
  const [reload, setReload] = React.useState(0);
  useEffect(() => {
    async function getPlusMinus() {
      if (props.matchId) {
        setPlusMinus(await fetchPlusMinus(props.matchId));
      }
    }
    getPlusMinus();
  }, [props, reload]);

  const reloadOnClick = () => {
    setReload(reload + 1);
  };

  if (!props.matchId) {
    return null; // If no match is selected then we don't display anything
  } else if (plusMinus === null) {
    return <CircularProgress />;
  } else if (plusMinus.length === 0) {
    return (
      <div>
        <Button variant="danger" onClick={reloadOnClick}>
          Couldn't Load Report <RefreshIcon />
        </Button>
      </div>
    );
  } else {
    return (
      <div className="PlusMinus">
        <TableContainer component={Paper} style={tableStyling}>
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
            {/* Adds the table body to a table frame just to avoid repeating */}
          </Table>
        </TableContainer>
      </div>
    );
  }
}
