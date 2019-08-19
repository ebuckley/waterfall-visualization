import { Component } from 'react'
import React from 'react';
import Loading from './Loading';
import Error from './Error';
import { getDatasets } from '../services/datasetService';

export default class DatasetReport extends Component {
    state = { loading: true, dataset: null, datasetName: null, error: null }
    componentDidMount() {
        const datasetName = this.props.match.params.name;

        this.setState({ datasetName: datasetName });
        getDatasets(datasetName)
            .then(result => {
                this.setState({ dataset: result, loading: false })
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }
    render() {
        if (this.state.error) {
            return (<Error error={this.state.error} />)
        } else if (this.state.loading) {
            return <Loading />
        } else {
            return <div>

                <h2>Raw Data</h2>
                <pre>{JSON.stringify(this.state.dataset, null, '   ')}</pre>
            </div>
        }
    }
}