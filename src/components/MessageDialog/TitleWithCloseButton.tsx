import React from 'react';
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SpaceBetweenFlex } from 'components/Container';

const DialogTitleWithCloseButton = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle {...other}>
            <SpaceBetweenFlex>
                {children}
                {onClose && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ float: 'right' }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </SpaceBetweenFlex>
        </DialogTitle>
    );
};

export default DialogTitleWithCloseButton;
