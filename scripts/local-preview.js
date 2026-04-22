const {ThemeMap} = require('../lib/const/theme');
const {createStatsCard} = require('../lib/templates/stats-card');
const {createDonutChartCard} = require('../lib/templates/donut-chart-card');
const {createProductiveCard} = require('../lib/templates/productive-time-card');
const {createDetailCard} = require('../lib/templates/profile-details-card');
const {Icon} = require('../lib/const/icon');
const fs = require('fs');
const path = require('path');

const theme = ThemeMap.get('megumi');
if (!theme) {
    console.error('megumi theme not registered');
    process.exit(1);
}

const outDir = '/tmp/megumi-cards';
fs.mkdirSync(outDir, {recursive: true});

const statsData = [
    {index: 0, icon: Icon.STAR, name: 'Total Stars Earned:', value: '123'},
    {index: 1, icon: Icon.COMMIT, name: 'Total Commits:', value: '4567'},
    {index: 2, icon: Icon.PR, name: 'Total PRs:', value: '89'},
    {index: 3, icon: Icon.ISSUE, name: 'Total Issues:', value: '21'},
    {index: 4, icon: Icon.CONTRIBUTE, name: 'Contributed To:', value: '34'}
];
fs.writeFileSync(path.join(outDir, 'stats.svg'), createStatsCard('Sisyphus Stats', statsData, theme));

const donutData = [
    {name: 'TypeScript', value: 400, color: '#e63946'},
    {name: 'JavaScript', value: 250, color: '#c8c2c6'},
    {name: 'Python', value: 100, color: '#888888'},
    {name: 'Go', value: 50, color: '#444444'}
];
fs.writeFileSync(path.join(outDir, 'donut.svg'), createDonutChartCard('Top Languages', donutData, theme));

const productiveData = Array.from({length: 24}, (_, i) => Math.round(Math.sin(i / 24 * Math.PI) * 50 + Math.random() * 10));
fs.writeFileSync(path.join(outDir, 'productive.svg'), createProductiveCard(productiveData, theme, 9));

const userDetails = [
    {index: 0, icon: Icon.USER, name: 'name', value: 'Sisyphus'},
    {index: 1, icon: Icon.STAR, name: 'star', value: '999'},
    {index: 2, icon: Icon.PR, name: 'pr', value: '42'}
];
const contributionsData = [];
const start = new Date('2025-01-01');
for (let i = 0; i < 12; i++) {
    contributionsData.push({contributionCount: Math.round(50 + Math.random() * 100), date: new Date(start.getFullYear(), start.getMonth() + i, 1)});
}
fs.writeFileSync(path.join(outDir, 'profile.svg'), createDetailCard('Profile', userDetails, contributionsData, theme));

console.log('Generated cards in', outDir);
const files = fs.readdirSync(outDir);
files.forEach(f => {
    const p = path.join(outDir, f);
    const stat = fs.statSync(p);
    const content = fs.readFileSync(p, 'utf8');
    const animateCount = (content.match(/<animate[ \/>]/g) || []).length;
    const setCount = (content.match(/<set /g) || []).length;
    const transformCount = (content.match(/<animateTransform/g) || []).length;
    console.log(`  ${f}: ${stat.size}B, animate=${animateCount}, animateTransform=${transformCount}, set=${setCount}`);
});
