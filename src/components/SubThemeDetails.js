import React from 'react';
import { Component } from 'react';
import './assets/subtheme-chart.css';

const VIEWBOX_X = 100;
const BAR_WIDTH = 10;

const sortByChangeWeight = direction => {
    if (direction === 'asc') {
        return (lhs, rhs) => rhs.theme.changeWeighting - lhs.theme.changeWeighting;
    } else {
        return (lhs, rhs) => lhs.theme.changeWeighting - rhs.theme.changeWeighting;
    }
}

function getListFromSubthemes(subtheme) {
    const positiveThemes = [];
    const negativeThemes = [];
    Object.keys(subtheme)
        .map(k => ({ name: k, theme: subtheme[k] }))
        .forEach((item) => {
            if (item.theme.changeWeighting > 0) {
                positiveThemes.push(item)
            } else {
                negativeThemes.push(item)
            }
        })

    return {
        positive: positiveThemes.sort(sortByChangeWeight('asc')),
        negativeThemes: negativeThemes.sort(sortByChangeWeight('desc'))
    }
}
function getDomain(subtheme) {
    const min = 0;
    let max = 0;
    Object.keys(subtheme)
        .map(k => ({ name: k, theme: subtheme[k] }))
        .forEach(item => {
            const absValue = Math.abs(item.theme.changeWeighting);
            if (absValue > max) {
                max = absValue
            }
        })
    const range = max - min
    return {
        min,
        max,
        range,
        // posx returns the graph coordinate from the data range
        posX: (scoreVal) => {
            return ((scoreVal - min) * VIEWBOX_X) / range
        }
    }
}

function BarChart(isNegative, series, domain) {
    const viewbox_y = series.length * BAR_WIDTH;
    const bars = series.map((item, i) => {

        const barClassName = isNegative ? 'barchart-bar negative' : 'barchart-bar';
        const size = domain.posX(Math.abs(item.theme.changeWeighting));
        let x = 0
        let textX = isNegative ? VIEWBOX_X : 0;
        let textAnchor = isNegative ? 'end' : '';
        const y = i * BAR_WIDTH

        if (isNegative) {
            x = VIEWBOX_X - size
        }

        return (<g key={item.name}>
            <rect className={barClassName} y={y + BAR_WIDTH * 0.8} x={x} width={size} height={BAR_WIDTH * 0.2} />
            <text textAnchor={textAnchor} dominantBaseline="middle" className="barchart-label" x={textX} y={y} dy={BAR_WIDTH / 2} >{item.name}</text>
        </g>)
    });

    let emptyMessage = isNegative ? "No negative contributions to this theme" : "No positive contributions to this theme"
    if (series.length == 0) {
        return (
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" className="chart" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 100 10`} aria-labelledby="title" role="img">
                <text textAnchor="middle" dominantBaseline="middle" className="barchart-label" x="50" y="5"> {emptyMessage} </text>
            </svg>)
    }
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" className="chart" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${VIEWBOX_X} ${viewbox_y}`} aria-labelledby="title" role="img">
            {bars}
        </svg>)
}
export default class SubThemeDetails extends Component {
    render() {
        const subTheme = this.props.subTheme
        if (!this.props.subTheme) {
            return <div></div>
        }
        const domain = getDomain(subTheme)
        const themes = getListFromSubthemes(subTheme)

        return <div className="butterflychart-wrapper">
            <div className="graph-title">
                <span className="text-heading">Sub Theme breakdown</span>

            </div>
            <figure className="positive-series">
                {BarChart(false, themes.positive, domain)}
            </figure>
            <figure className="negative-series">
                {BarChart(true, themes.negativeThemes, domain)}
            </figure>
        </div >
    }
}