import { grid } from './components/_grid.js'
import { range } from './components/_range.js'
import { sticky } from './components/_sticky.js'

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(grid, 100);
    
    range;

    sticky;
})

window.addEventListener('resize', () => {
    grid();
})