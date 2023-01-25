import React, { useContext, useState } from 'react';
import SidebarButton from './Button';
import constants from 'utils/strings/constants';
// import FixLargeThumbnails from 'components/FixLargeThumbnail';
import RecoveryKey from 'components/RecoveryKey';
import TwoFactorModal from 'components/TwoFactor/Modal';
import { PAGES } from 'constants/pages';
import { useRouter } from 'next/router';
import { AppContext } from 'pages/_app';
import { canEnableMlSearch } from 'utils/machineLearning/compatibility';
// import mlIDbStorage from 'utils/storage/mlIDbStorage';
import isElectron from 'is-electron';
import WatchFolder from 'components/WatchFolder';
import { getDownloadAppMessage } from 'utils/ui';

import ThemeSwitcher from './ThemeSwitcher';
import { SpaceBetweenFlex } from 'components/Container';
import { isInternalUser } from 'utils/user';

export default function UtilitySection({ closeSidebar }) {
    const router = useRouter();
    const {
        setDialogMessage,
        startLoading,
        mlSearchEnabled,
        updateMlSearchEnabled,
        watchFolderView,
        setWatchFolderView,
        theme,
        setTheme,
    } = useContext(AppContext);

    const [recoverModalView, setRecoveryModalView] = useState(false);
    const [twoFactorModalView, setTwoFactorModalView] = useState(false);
    // const [fixLargeThumbsView, setFixLargeThumbsView] = useState(false);

    const openRecoveryKeyModal = () => setRecoveryModalView(true);
    const closeRecoveryKeyModal = () => setRecoveryModalView(false);

    const openTwoFactorModal = () => setTwoFactorModalView(true);
    const closeTwoFactorModal = () => setTwoFactorModalView(false);

    const openWatchFolder = () => {
        if (isElectron()) {
            setWatchFolderView(true);
        } else {
            setDialogMessage(getDownloadAppMessage());
        }
    };
    const closeWatchFolder = () => setWatchFolderView(false);

    const redirectToChangePasswordPage = () => {
        closeSidebar();
        router.push(PAGES.CHANGE_PASSWORD);
    };

    const redirectToChangeEmailPage = () => {
        closeSidebar();
        router.push(PAGES.CHANGE_EMAIL);
    };

    const redirectToDeduplicatePage = () => router.push(PAGES.DEDUPLICATE);

    // const openThumbnailCompressModal = () => setFixLargeThumbsView(true);

    const somethingWentWrong = () =>
        setDialogMessage({
            title: constants.ERROR,
            content: constants.RECOVER_KEY_GENERATION_FAILED,
            close: { variant: 'danger' },
        });

    // const redirectToMLDebug = () => {
    //     router.push(PAGES.ML_DEBUG);
    // };

    const enableMlSearch = async () => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await updateMlSearchEnabled(true);
    };
    const disableMlSearch = async () => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await updateMlSearchEnabled(false);
    };

    // const clearMLDB = async () => {
    //     await mlIDbStorage.clearMLDB();
    // };

    const toggleMLSearch = () => {
        if (!mlSearchEnabled) {
            if (!canEnableMlSearch()) {
                setDialogMessage({
                    title: constants.ENABLE_ML_SEARCH,
                    content: constants.ML_SEARCH_NOT_COMPATIBLE,
                    close: { text: constants.OK },
                });
                return;
            }
            setDialogMessage({
                title: constants.ENABLE_ML_SEARCH,
                content: constants.ENABLE_ML_SEARCH_MESSAGE,
                staticBackdrop: true,
                proceed: {
                    text: constants.ENABLE,
                    action: enableMlSearch,
                    variant: 'accent',
                },
                close: { text: constants.CANCEL },
            });
        } else {
            disableMlSearch();
        }
    };
    return (
        <>
            {isElectron() && (
                <SidebarButton onClick={openWatchFolder}>
                    {constants.WATCH_FOLDERS}
                </SidebarButton>
            )}
            <SidebarButton onClick={openRecoveryKeyModal}>
                {constants.RECOVERY_KEY}
            </SidebarButton>
            {isInternalUser() && (
                <SpaceBetweenFlex sx={{ px: 1.5 }}>
                    {constants.CHOSE_THEME}
                    <ThemeSwitcher theme={theme} setTheme={setTheme} />
                </SpaceBetweenFlex>
            )}
            <SidebarButton onClick={openTwoFactorModal}>
                {constants.TWO_FACTOR}
            </SidebarButton>
            <SidebarButton onClick={redirectToChangePasswordPage}>
                {constants.CHANGE_PASSWORD}
            </SidebarButton>
            <SidebarButton onClick={redirectToChangeEmailPage}>
                {constants.CHANGE_EMAIL}
            </SidebarButton>
            <SidebarButton onClick={redirectToDeduplicatePage}>
                {constants.DEDUPLICATE_FILES}
            </SidebarButton>
            <SidebarButton onClick={toggleMLSearch}>
                {mlSearchEnabled
                    ? constants.DISABLE_ML_SEARCH
                    : constants.ENABLE_ML_SEARCH}
            </SidebarButton>

            {/* <SidebarButton
                onClick={() => {
                    if (!mlSearchEnabled) {
                        if (!canEnableMlSearch()) {
                            setDialogMessage({
                                title: constants.ENABLE_ML_SEARCH,
                                content: constants.ML_SEARCH_NOT_COMPATIBLE,
                                close: { text: constants.OK },
                            });
                            return;
                        }
                        setDialogMessage({
                            title: 'clear mb db',
                            content: 'clear mb db',
                            staticBackdrop: true,
                            proceed: {
                                text: 'clear',
                                action: clearMLDB,
                                variant: 'accent',
                            },
                            close: { text: constants.CANCEL },
                        });
                    } else {
                        disableMlSearch();
                    }
                }}>
                {'Clear ML db'}
            </SidebarButton>

            <SidebarButton onClick={redirectToMLDebug}>
                {constants.ML_DEBUG}
            </SidebarButton> */}

            {/* <SidebarButton onClick={openThumbnailCompressModal}>
                {constants.COMPRESS_THUMBNAILS}
            </SidebarButton> */}
            <RecoveryKey
                show={recoverModalView}
                onHide={closeRecoveryKeyModal}
                somethingWentWrong={somethingWentWrong}
            />
            <TwoFactorModal
                show={twoFactorModalView}
                onHide={closeTwoFactorModal}
                closeSidebar={closeSidebar}
                setLoading={startLoading}
            />
            <WatchFolder open={watchFolderView} onClose={closeWatchFolder} />
            {/* <FixLargeThumbnails
                isOpen={fixLargeThumbsView}
                hide={() => setFixLargeThumbsView(false)}
                show={() => setFixLargeThumbsView(true)}
            /> */}
        </>
    );
}
