import auth from './authService';
import { DataService } from './sharedUtil';

/// getProfile will fetch profile details about the user
export function getProfile() {
    // TODO prob better to inject auth service so we can more easily mock?
    const ds = new DataService(auth)
    return ds.get(['current-user'])
}