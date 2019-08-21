import React from 'react';

import { storiesOf } from '@storybook/react';
import ThemeWaterfall from '../components/ThemeWaterfall';
import mocks from '../mocks/twitch';
import '../index.css';
import ThemeDetails from '../components/ThemeDetails';
import mockSubTheme from '../mocks/subtheme.json';
import fullsubtheme from '../mocks/update_subtheme.json';
import SubThemeDetails from '../components/SubThemeDetails';


storiesOf('Waterfall Visualization', module)
  .add('with a default vertical layout', () => <ThemeWaterfall dataset={mocks} />)
  .add('just the theme details', () => <ThemeDetails theme={mocks.themes['twitch app']} />)
  .add('just the sub theme details', () => <SubThemeDetails theme={"update twitch"} subTheme={fullsubtheme} />)
