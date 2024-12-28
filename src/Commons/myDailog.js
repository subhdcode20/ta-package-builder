import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function CustomizedDialogs({ 
    showDailog=false, 
    title = '', 
    body = '', 
    showActions = false,
    fullScreen = false,
    handleClose = null
  }) {
  const [open, setOpen] = React.useState(showDailog);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const _handleClose = () => {
    setOpen(false);
  };

  return (<Dialog
        onClose={handleClose || _handleClose}
        open={showDailog}
        fullScreen={fullScreen}
      >
        {
          title && (<DialogTitle id="customized-dialog-title" onClose={_handleClose}>
            {title}
          </DialogTitle>)
        }
        <DialogContent dividers>
          {body}
        </DialogContent>
        { handleClose && (<DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>)}
    </Dialog>);
}
