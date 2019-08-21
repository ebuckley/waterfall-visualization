import React from 'react';
import { Component } from 'react';

import './assets/waterfall-theme.css'
import { roundNumber } from '../services/sharedUtil'
const VIEWBOX_X = 100
const BAR_WIDTH = 10
const UNTHEMED_NAME = 'unthemed weighting'

// takes dataset model and return an array of themes with
// postive changeweighting ordered before negative
function getOrderedThemeList(dataset) {
  // Include the unthemedweighting
  const unThemedWeighting = {
    name: UNTHEMED_NAME,
    changeWeighting: dataset.unthemedWeighting
  }

  const themes = Object.keys(dataset.themes)
    .map(key => Object.assign({ name: key }, dataset.themes[key]))

  themes.push(unThemedWeighting)
  return themes
    .sort((lhs, rhs) => rhs.changeWeighting - lhs.changeWeighting)
}

// Returns an ordered list of themes, with postivie changeweights first.
function datasetToLinksModel(dataset) {
  const themes = getOrderedThemeList(dataset)

  // keep track of the last score position
  let cumulativePosition = dataset.previousScore.score
  const getY = (index) => (index + 1) * BAR_WIDTH
  const linksModel = themes
    .map((theme, index) => {
      const y = getY(index)
      const previousScore = cumulativePosition
      cumulativePosition += theme.changeWeighting
      return { key: theme.name, y, previousScore, changeWeighting: theme.changeWeighting }
    })

  return linksModel
}

function getNumberOfBars(dataset) {
  // 3 bars + number of themes
  return 3 + Object.keys(dataset.themes).length
}

function getMaximumScore(dataset) {
  // get the maximum score from the dataset
  const orderedThemes = getOrderedThemeList(dataset)
  const unthemedWeightContribution = dataset.unthemedWeighting > 0 ? dataset.unthemedWeighting : 0
  return unthemedWeightContribution + orderedThemes.reduce((acc, theme) => {
    if (theme.changeWeighting < 0) {
      return acc
    } else {
      return acc + theme.changeWeighting
    }
  }, dataset.previousScore.score)
}

function getMinimumScore(dataset) {
  // get the minimum score from the dataset, because we are rendering the +ve
  // changes before the negative, the minimum score will always be the previousScore/EndScore.
  return dataset.previousScore.score > dataset.score.score ? dataset.score.score : dataset.previousScore.score
}

// Get the domain of the graph, return min/maxes and conversion functions for getting graph coordinates
function getDomain(dataset) {
  let max = getMaximumScore(dataset)
  let min = getMinimumScore(dataset)
  let range = (max - min)
  // add some padding to the outside
  const padding = range * 0.1
  max = max + padding
  min = min - padding * 4
  range = max - min

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

function getTheme(dataset, key) {
  return dataset.themes[key]
}
// Build context required to render the graph
function buildGraphcontext(dataset, clickedDrawLink) {
  const domain = getDomain(dataset)


  function Bar({ period, score, y }) {
    return (
      <g className="bar">
        <rect className="score-bar" y={y} width={domain.posX(score)} height={BAR_WIDTH}></rect>
        <text dominantBaseline="middle" className="bar-score" dx="1%" x={domain.posX(score)} y={y + (BAR_WIDTH * 0.35)}>{roundNumber(score)}</text>
        <text dominantBaseline="middle" className="bar-period" dx="1%" x={domain.posX(score)} y={y + (BAR_WIDTH * 0.6)}>{period}</text>
      </g >
    )
  }

  function DrawLink({ key, y, previousScore, changeWeighting }) {
    let xPosition, width, className, y1, y2, lineX
    const barSpace = BAR_WIDTH * 0.7
    if (changeWeighting > 0) {
      xPosition = domain.posX(previousScore)
      width = domain.posX(changeWeighting + previousScore) - xPosition
      y1 = y - (BAR_WIDTH / 2)
      y2 = y + (BAR_WIDTH / 2)
      lineX = xPosition
      className = 'positive'
    } else {
      xPosition = domain.posX(previousScore + changeWeighting)
      width = domain.posX(previousScore) - xPosition
      y1 = y + (BAR_WIDTH / 2)
      y2 = y - (BAR_WIDTH / 2)
      lineX = xPosition + width
      className = 'negative'
    }
    const theme = getTheme(dataset, key)
    let highlightMessage = ''
    if (theme && theme.sentiment) {
      highlightMessage = roundNumber(theme.sentiment)
    }
    return (
      <g onClick={() => clickedDrawLink(key)} key={key} className="waterfall-link" >
        <rect className="highlight-bar" y={y} width={VIEWBOX_X} height={BAR_WIDTH}></rect>
        <line className="dashed-line" strokeDasharray="0.5" x1={lineX} y1={y1} x2={lineX} y2={y2 + 2}></line>
        <rect className={className} y={y + (barSpace * 0.5)} x={xPosition} width={width} height={BAR_WIDTH - barSpace}></rect>
        <text dominantBaseline="middle" className="waterfall-score" x="2%" y={y + (BAR_WIDTH * 0.4)}>{key}</text>
        <text dominantBaseline="middle" className="waterfall-score" dx="1%" x={xPosition + width} y={y + (BAR_WIDTH * 0.4)}>{roundNumber(changeWeighting)}</text>

        <g className="highlight-text">
          <text dominantBaseline="middle" dx="-1%" x={xPosition} y={y + (BAR_WIDTH * 0.4)}> {highlightMessage}</text>
        </g>
      </g>
    )
  }

  return {
    domain,
    DrawLink,
    Bar
  }
}

export default class ThemeWaterfall extends Component {
  render() {
    const dataset = this.props.dataset
    if (!dataset) {
      return <div />
    }

    const viewbox_y = getNumberOfBars(dataset) * BAR_WIDTH  // TODO get graph range based on number of themes to display.

    const clickedDrawLink = (key) => {
      const theme = getTheme(dataset, key)
      if (this.props.onSelectTheme) {
        this.props.onSelectTheme(key, theme)
      }
    }

    const { Bar, DrawLink, domain } = buildGraphcontext(dataset, clickedDrawLink)
    const links = datasetToLinksModel(dataset, domain)
    const finalX = domain.posX(dataset.score.score)

    return (
      <figure>
        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink' className='chart' preserveAspectRatio='xMidYMid meet' viewBox={`0 0 ${VIEWBOX_X} ${viewbox_y}`} aria-labelledby='title' role='img'>
          <title id='title'>An interactive waterfall chart showing theme performance for the current period</title>
          <Bar period={dataset.previousPeriod} score={dataset.previousScore.score} y='0' />
          {links.map(DrawLink)}
          <line className='dashed-line' strokeDasharray='0.5' x1={finalX} y1={viewbox_y - BAR_WIDTH - 5} x2={finalX} y2={viewbox_y - BAR_WIDTH + 5} />
          <Bar period={dataset.period} score={dataset.score.score} y={viewbox_y - BAR_WIDTH} />
        </svg>
      </figure>)
  }
}
