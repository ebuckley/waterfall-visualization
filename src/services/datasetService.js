import { DataService } from "./sharedUtil";
import auth from './authService';


export function getDatasets(datasetName) {
    if (!datasetName) {
        return Promise.reject("getDatasets was called without a dataset name parameter");
    }
    const ds = new DataService(auth);
    return ds.get(['datasets', datasetName]);
}

