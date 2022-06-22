import { FluidContainer } from 'components/Container';
import { SelectionBar } from '../../Navbar/SelectionBar';
import constants from 'utils/strings/constants';
import DeleteIcon from 'components/icons/DeleteIcon';
import React, { useContext } from 'react';
import { Box, IconButton, styled } from '@mui/material';
import { DeduplicateContext } from 'pages/deduplicate';
import { IconWithMessage } from 'components/IconWithMessage';
import { AppContext } from 'pages/_app';
import CloseIcon from '@mui/icons-material/Close';
import BackButton from '@mui/icons-material/ArrowBackOutlined';

const VerticalLine = styled('div')`
    position: absolute;
    width: 1px;
    top: 0;
    bottom: 0;
    background: #303030;
`;

const CheckboxText = styled('div')`
    margin-left: 0.5em;
    font-size: 16px;
    margin-right: 0.8em;
`;

interface IProps {
    deleteFileHelper: () => void;
    close: () => void;
    count: number;
    clearSelection: () => void;
}

export default function DeduplicateOptions({
    deleteFileHelper,
    close,
    count,
    clearSelection,
}: IProps) {
    const deduplicateContext = useContext(DeduplicateContext);
    const { setDialogMessage } = useContext(AppContext);

    const trashHandler = () =>
        setDialogMessage({
            title: constants.CONFIRM_DELETE,
            content: constants.TRASH_MESSAGE,
            proceed: {
                action: deleteFileHelper,
                text: constants.MOVE_TO_TRASH,
                variant: 'danger',
            },
            close: { text: constants.CANCEL },
        });

    return (
        <SelectionBar>
            <FluidContainer>
                {count ? (
                    <IconButton onClick={clearSelection}>
                        <CloseIcon />
                    </IconButton>
                ) : (
                    <IconButton onClick={close}>
                        <BackButton />
                    </IconButton>
                )}
                <Box ml={'12px'}>
                    {count} {constants.SELECTED}
                </Box>
            </FluidContainer>
            <input
                type="checkbox"
                style={{
                    width: '1em',
                    height: '1em',
                }}
                value={
                    deduplicateContext.clubSameTimeFilesOnly ? 'true' : 'false'
                }
                onChange={() => {
                    deduplicateContext.setClubSameTimeFilesOnly(
                        !deduplicateContext.clubSameTimeFilesOnly
                    );
                }}></input>
            <CheckboxText>{constants.CLUB_BY_CAPTURE_TIME}</CheckboxText>
            <div>
                <VerticalLine />
            </div>
            <IconWithMessage message={constants.DELETE}>
                <IconButton onClick={trashHandler}>
                    <DeleteIcon />
                </IconButton>
            </IconWithMessage>
        </SelectionBar>
    );
}
