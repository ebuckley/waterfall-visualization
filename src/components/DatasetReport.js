import { Component } from 'react'
import React from 'react';
import Loading from './Loading';
import Error from './Error';
import { getDatasets, getSubThemes } from '../services/datasetService';
import ThemeWaterfall from './ThemeWaterfall';
import ThemeDetails from './ThemeDetails';
import SubThemeDetails from './SubThemeDetails';

export default class DatasetReport extends Component {
    state = {
        loading: true,
        dataset: null,
        datasetName: null,
        error: null,
        subTheme: {},
        activeSubTheme: null,
        activeTheme: null,
        activeThemeName: null,
        loadingSidebar: false,
    };

    constructor() {
        super();
        this.selectTheme.bind(this);
    }

    selectTheme(key, theme) {
        if (this.state.subTheme[key]) {
            this.setState({ activeTheme: theme, activeThemeName: key, activeSubTheme: this.state.subTheme[key] });
            return;
        }
        this.setState({ loadingSidebar: true, activeThemeName: key, })
        getSubThemes(this.state.datasetName, key)
            .then(subthemes => {
                const newThemes = Object.assign(this.state.subTheme, { [key]: subthemes });
                const updatedState = {
                    activeTheme: theme,
                    activeSubTheme: subthemes,
                    subTheme: newThemes
                };
                this.setState(updatedState);
            })
            .catch(err => {
                if (err.body && err.body.code === 404) {
                    // TODO ping user facing error here
                    console.error('Could not load this subtheme');
                    this.setState({ activeSubTheme: null })
                    return
                }
                this.setState({ error: err })
            })
            .finally(() => this.setState({ loadingSidebar: false }))
    }

    componentDidMount() {
        const datasetName = this.props.match.params.name;

        this.setState({ datasetName: datasetName });
        getDatasets(datasetName)
            .then(result => {
                this.setState({ dataset: result, loading: false });
            })
            .catch(err => {
                this.setState({ error: err });
            });
    }

    render() {
        const fetchTheme = (key, theme) => this.selectTheme(key, theme);
        const onHideSidebar = () => this.setState({ activeTheme: null, activeThemeName: null, activeSubTheme: null })
        const sideBarClass = !this.state.activeThemeName ? 'subtheme-sidebar hidden' : 'subtheme-sidebar'

        let sideBarContent = <div>
            <ThemeDetails theme={this.state.activeTheme} />
            <SubThemeDetails subTheme={this.state.activeSubTheme} />
        </div>
        if (this.state.loadingSidebar) {
            sideBarContent = <Loading />
        }

        if (this.state.error) {
            return (<Error error={this.state.error} />)
        } else if (this.state.loading) {
            return <Loading />
        } else {
            return <div className="dataset-view-container">
                <div className={sideBarClass}>
                    <div className="sidebar-heading">
                        <h2>{this.state.activeThemeName}</h2>
                        <a href="javascript:void()" onClick={onHideSidebar} >Close</a>
                    </div>
                    {sideBarContent}
                </div>

                <div className="waterfall-container">
                    <ThemeWaterfall onSelectTheme={fetchTheme} dataset={this.state.dataset} />
                </div>
            </div>
        }
    }
}