import { DataService } from './sharedUtil'
import auth from './authService'

export function getDatasets (datasetName) {
  if (!datasetName) {
    return Promise.reject('getDatasets was called without a dataset name parameter')
  }
  const ds = new DataService(auth)
  return ds.get(['datasets', datasetName])
}

export function getSubThemes (datasetName, theme) {
  if (!datasetName || !theme) {
    return Promise.reject('getSubThemes was called without a dataset or theme parameter')
  }
  const ds = new DataService(auth)
  return ds.get(['datasets', datasetName, theme])
}
