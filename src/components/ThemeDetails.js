import React from 'react';
import { Component } from 'react';


export default class ThemeDetails extends Component {
    render() {
        const theme = this.props.theme
        if (!this.props.theme) {
            return <div></div>
        }
        return <div>
            <span className="text-heading">
                Details
            </span>

            <dl>
                <dt>Sentiment</dt>
                <dd>{theme.sentiment}</dd>
                <dt>Change Weighting</dt>
                <dd>{theme.changeWeighting}</dd>
                <dt>raw</dt>
                <dd><pre>{JSON.stringify(theme, null, '   ')}</pre></dd>
            </dl>
        </div>
    }
}