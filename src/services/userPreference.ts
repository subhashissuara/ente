import { userPreferencesStore } from '../stores/userPreferences.store';

export function getHideDockIconPreference() {
    return userPreferencesStore.get('hideDockIcon');
}

export function setHideDockIconPreference(shouldHideDockIcon: boolean) {
    userPreferencesStore.set('hideDockIcon', shouldHideDockIcon);
}

export function getSkipAppVersion() {
    return userPreferencesStore.get('skipAppVersion');
}

export function setSkipAppVersion(version: string) {
    userPreferencesStore.set('skipAppVersion', version);
}

export function getMuteUpdateNotificationVersion() {
    return userPreferencesStore.get('muteUpdateNotificationVersion');
}

export function setMuteUpdateNotificationVersion(version: string) {
    userPreferencesStore.set('muteUpdateNotificationVersion', version);
}

export function getOptOutOfCrashReports() {
    return userPreferencesStore.get('optOutOfCrashReports') ?? false;
}

export function setOptOutOfCrashReports(optOut: boolean) {
    userPreferencesStore.set('optOutOfCrashReports', optOut);
}
