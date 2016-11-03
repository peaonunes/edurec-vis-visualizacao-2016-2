const d3 = require('d3');
import { renderMap } from './ui/map.js';

document.addEventListener('DOMContentLoaded', () => {
    d3.select('#content')
        .append('h1')
        .text('Coming soon...');

    renderMap();
});
