import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PopUp = (props) => {
    const [disableButton, setDisableButton] = useState(false);

    const handleOnClick = () => {
        setDisableButton(true);
        props.onClick();
    }

    return (
        <Modal open={props.open}
            onClose={props.onClose}
            disableEnforceFocus
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 3,
                textAlign: 'center',
            }}>

                <Typography sx={{ textAlign: 'center', color: 'primary', fontSize: '18px', fontWeight:600 }}>
                    <CheckCircleIcon sx={{ color: 'green' }} />
                    <br />
                    {props.primaryText}<span style={{ fontSize: '25px' }}>{props.checkMark && " ✔"} </span>
                </Typography>
                <Typography sx={{ textAlign: 'center', color: 'secondary', fontSize: '16px' }}>
                    {props.secondaryText}
                </Typography>
                <Button
                    size="small"
                    variant="outlined"
                    href={props.forwardRef || null}
                    onClick={props.onClick}
                    sx={{ alignItems: 'center', mt: 2, color: "secondary" }}
                >
                    {props.submitText}
                </Button>
            </Box>
        </Modal>
    );
};

export default PopUp;
