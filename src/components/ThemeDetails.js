import React from 'react';
import { Component } from 'react';
import { roundNumber } from '../services/sharedUtil';


function themeFact(value, label) {
    return <div className="theme-fact">
        <div className="theme-value">{value}</div>
        <div className="theme-label">{label}</div>
    </div>
}
export default class ThemeDetails extends Component {
    render() {
        const theme = this.props.theme
        if (!this.props.theme) {
            return <div></div>
        }
        return <div className="theme-details-wrapper">
            {themeFact(roundNumber(theme.sentiment), 'Sentiment')}
            {themeFact(roundNumber(theme.changeWeighting), 'Change Weighting')}
            {themeFact(roundNumber(theme.previousScore.score), 'Previous Score')}
            {themeFact(roundNumber(theme.score.score), 'Score')}
        </div>
    }
}