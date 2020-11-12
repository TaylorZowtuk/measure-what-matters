import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface Props {
  isOpen: boolean;
  handleConfirmation(): void;
  handleCancel(): void;
  title?: string;
  subtitle?: string;
  children?: any;
  confirmationButtonText: string;
  denyButtonText: string;
}

export default function CustomDialog(props: Props) {
  return (
    <div>
      <Dialog open={props.isOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.subtitle}</DialogContentText>
          {props.children}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCancel} color="primary">
            {props.denyButtonText}
          </Button>
          <Button onClick={props.handleConfirmation} color="primary">
            {props.confirmationButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
