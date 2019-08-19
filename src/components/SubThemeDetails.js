import React from 'react';
import { Component } from 'react';


export default class SubThemeDetails extends Component {
    render() {
        const subTheme = this.props.subTheme
        if (!this.props.subTheme) {
            return <div></div>
        }
        return <div>
            <span className="text-heading">
                Subtheme breakdown
            </span>
            <dl>
                {/* <dt>Sentiment</dt>
                <dd>{subTheme.previousSentiment}</dd>
                <dt>Change Weighting</dt>
                <dd>{subTheme.changeWeighting}</dd> */}
                <dt>raw</dt>
                <dd><pre>{JSON.stringify(subTheme, null, '   ')}</pre></dd>
            </dl>
        </div>
    }
}