#!/usr/bin/env node
'use strict';
import React from 'react'
import importJsx from 'import-jsx';
import { render } from 'ink';

const Blackjack = importJsx('./Blackjack');

render(React.createElement(Blackjack));
