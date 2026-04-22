"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = exports.ThemeMap = void 0;
exports.ThemeMap = new Map();
class Theme {
    constructor(title, text, background, stroke, strokeOpacity, icon, chart) {
        this.title = title;
        this.text = text;
        this.background = background;
        this.stroke = stroke;
        this.strokeOpacity = strokeOpacity;
        this.icon = icon;
        this.chart = chart;
    }
}
exports.Theme = Theme;
// Set up themes
// We support short hex color, hex color and RGBA hex
// ThemeMap.set(name, new Theme('title', 'text', 'background', 'stroke', 'strokeOpacity', 'icon', 'chart'));
exports.ThemeMap.set('holi', new Theme('#5ea9eb', '#d6e7ff', '#030314', '#d6e7ff', 1, '#5090cb', '#5090cb'));
exports.ThemeMap.set('2077', new Theme('#ff0055', '#03d8f3', '#141321', '#141321', 1, '#fcee0c', '#00ffc8'));
exports.ThemeMap.set('algolia', new Theme('#00aeff', '#ffffff', '#050f2c', '#000000', 0, '#2dde98', '#00aeff'));
exports.ThemeMap.set('apprentice', new Theme('#ffffff', '#bcbcbc', '#262626', '#000000', 0, '#ffffaf', '#ffffff'));
exports.ThemeMap.set('aura_dark', new Theme('#ff7372', '#dbdbdb', '#252334', '#000000', 0, '#6cffd0', '#ff7372'));
exports.ThemeMap.set('aura', new Theme('#a277ff', '#61ffca', '#15141b', '#000000', 0, '#ffca85', '#a277ff'));
exports.ThemeMap.set('ayu_mirage', new Theme('#f4cd7c', '#c7c8c2', '#1f2430', '#000000', 0, '#73d0ff', '#f4cd7c'));
exports.ThemeMap.set('bear', new Theme('#e03c8a', '#bcb28d', '#1f2023', '#000000', 0, '#00aeff', '#e03c8a'));
exports.ThemeMap.set('blue_green', new Theme('#2f97c1', '#0cf574', '#040f0f', '#000000', 0, '#f5b700', '#2f97c1'));
exports.ThemeMap.set('blueberry', new Theme('#82aaff', '#27e8a7', '#242938', '#000000', 0, '#89ddff', '#82aaff'));
exports.ThemeMap.set('buefy', new Theme('#7957d5', '#363636', '#ffffff', '#000000', 0, '#ff3860', '#7957d5'));
exports.ThemeMap.set('calm', new Theme('#e07a5f', '#ebcfb2', '#373f51', '#000000', 0, '#edae49', '#e07a5f'));
exports.ThemeMap.set('chartreuse_dark', new Theme('#7fff00', '#fff', '#000', '#000000', 1, '#00aeff', '#7fff00'));
exports.ThemeMap.set('city_lights', new Theme('#5d8cb3', '#718ca1', '#1d252c', '#000000', 0, '#4798ff', '#5d8cb3'));
exports.ThemeMap.set('cobalt', new Theme('#e683d9', '#75eeb2', '#193549', '#000000', 0, '#0480ef', '#e683d9'));
exports.ThemeMap.set('cobalt2', new Theme('#ffc600', '#0088ff', '#193549', '#000000', 0, '#ffffff', '#ffc600'));
exports.ThemeMap.set('codeSTACKr', new Theme('#ff652f', '#ffffff', '#09131b', '#0c1a25', 1, '#ffe400', '#ff652f'));
exports.ThemeMap.set('darcula', new Theme('#ba5f17', '#bebebe', '#242424', '#000000', 0, '#ffb74d', '#ba5f17'));
exports.ThemeMap.set('dark', new Theme('#fff', '#9f9f9f', '#151515', '#000000', 0, '#79ff97', '#fff'));
exports.ThemeMap.set('date_night', new Theme('#da7885', '#e1b2a2', '#170f0c', '#170f0c', 1, '#bb8470', '#da7885'));
exports.ThemeMap.set('default', new Theme('#586e75', '#586e75', '#ffffff', '#e4e2e2', 1, '#586e75', '#586e75'));
exports.ThemeMap.set('discord_old_blurple', new Theme('#7289da', '#ffffff', '#2c2f33', '#000000', 0, '#7289da', '#7289da'));
exports.ThemeMap.set('dracula', new Theme('#ff79c6', '#ffb86c', '#282a36', '#282a36', 1, '#6272a4', '#bd93f9'));
exports.ThemeMap.set('flag_india', new Theme('#ff8f1c', '#509e2f', '#ffffff', '#000000', 0, '#250e62', '#ff8f1c'));
exports.ThemeMap.set('github_dark', new Theme('#0366d6', '#77909c', '#0d1117', '#2e343b', 1, '#8b949e', '#40c463'));
exports.ThemeMap.set('github', new Theme('#0366d6', '#586069', '#ffffff', '#e4e2e2', 1, '#586069', '#40c463'));
exports.ThemeMap.set('gotham', new Theme('#2aa889', '#99d1ce', '#0c1014', '#000000', 1, '#599cab', '#2aa889'));
exports.ThemeMap.set('graywhite', new Theme('#24292e', '#24292e', '#ffffff', '#000000', 0, '#24292e', '#24292e'));
exports.ThemeMap.set('great_gatsby', new Theme('#ffa726', '#ffd95b', '#000000', '#000000', 0, '#ffb74d', '#ffa726'));
exports.ThemeMap.set('gruvbox', new Theme('#fabd2f', '#8ec07c', '#282828', '#282828', 1, '#fe8019', '#fe8019'));
exports.ThemeMap.set('highcontrast', new Theme('#e7f216', '#fff', '#000', '#000000', 0, '#00ffff', '#e7f216'));
exports.ThemeMap.set('jolly', new Theme('#ff64da', '#ffffff', '#291b3e', '#000000', 0, '#a960ff', '#ff64da'));
exports.ThemeMap.set('kacho_ga', new Theme('#bf4a3f', '#d9c8a9', '#402b23', '#000000', 0, '#a64833', '#bf4a3f'));
exports.ThemeMap.set('maroongold', new Theme('#f7ef8a', '#e0aa3e', '#260000', '#000000', 0, '#f7ef8a', '#f7ef8a'));
exports.ThemeMap.set('material_palenight', new Theme('#c792ea', '#a6accd', '#292d3e', '#000000', 0, '#89ddff', '#c792ea'));
exports.ThemeMap.set('merko', new Theme('#abd200', '#68b587', '#0a0f0b', '#000000', 0, '#b7d364', '#abd200'));
exports.ThemeMap.set('midnight_purple', new Theme('#9745f5', '#ffffff', '#000000', '#000000', 0, '#9f4bff', '#9745f5'));
exports.ThemeMap.set('moltack', new Theme('#86092c', '#574038', '#f5e1c0', '#000000', 0, '#86092c', '#86092c'));
exports.ThemeMap.set('monokai', new Theme('#eb1f6a', '#ffffff', '#2c292d', '#2c292d', 1, '#e28905', '#ae81ff'));
exports.ThemeMap.set('moonlight', new Theme('#ff757f', '#f8f8f8', '#222436', '#222436', 1, '#599dff', '#ff757f'));
exports.ThemeMap.set('nightowl', new Theme('#c792ea', '#7fdbca', '#011627', '#000000', 0, '#ffeb95', '#c792ea'));
exports.ThemeMap.set('noctis_minimus', new Theme('#d3b692', '#c5cdd3', '#1b2932', '#000000', 0, '#72b7c0', '#d3b692'));
exports.ThemeMap.set('nord_bright', new Theme('#3b4252', '#2e3440', '#eceff4', '#e5e9f0', 1, '#8fbcbb', '#88c0d0'));
exports.ThemeMap.set('nord_dark', new Theme('#eceff4', '#e5e9f0', '#2e3440', '#eceff4', 1, '#8fbcbb', '#88c0d0'));
exports.ThemeMap.set('ocean_dark', new Theme('#8957b2', '#92d534', '#151a28', '#000000', 0, '#ffffff', '#8957b2'));
exports.ThemeMap.set('omni', new Theme('#ff79c6', '#e1e1e6', '#191622', '#000000', 0, '#e7de79', '#ff79c6'));
exports.ThemeMap.set('onedark', new Theme('#e4bf7a', '#df6d74', '#282c34', '#000000', 0, '#8eb573', '#e4bf7a'));
exports.ThemeMap.set('outrun', new Theme('#ffcc00', '#8080ff', '#141439', '#000000', 0, '#ff1aff', '#ffcc00'));
exports.ThemeMap.set('panda', new Theme('#19f9d899', '#ff75b5', '#31353a', '#000000', 0, '#19f9d899', '#19f9d899'));
exports.ThemeMap.set('prussian', new Theme('#bddfff', '#6e93b5', '#172f45', '#000000', 0, '#38a0ff', '#bddfff'));
exports.ThemeMap.set('radical', new Theme('#fe428e', '#a9fef7', '#141321', '#141321', 1, '#f8d847', '#ae81ff'));
exports.ThemeMap.set('react', new Theme('#61dafb', '#ffffff', '#20232a', '#000000', 0, '#61dafb', '#61dafb'));
exports.ThemeMap.set('rose_pine', new Theme('#9ccfd8', '#e0def4', '#191724', '#000000', 0, '#ebbcba', '#9ccfd8'));
exports.ThemeMap.set('shades_of_purple', new Theme('#fad000', '#a599e9', '#2d2b55', '#000000', 0, '#b362ff', '#fad000'));
exports.ThemeMap.set('slateorange', new Theme('#faa627', '#ffffff', '#36393f', '#000000', 0, '#faa627', '#faa627'));
exports.ThemeMap.set('solarized_dark', new Theme('#268bd2', '#839496', '#073642', '#073642', 1, '#b58900', '#859900'));
exports.ThemeMap.set('solarized', new Theme('#268bd2', '#586e75', '#fdf6e3', '#fdf6e3', 1, '#b58900', '#859900'));
exports.ThemeMap.set('swift', new Theme('#000000', '#000000', '#f7f7f7', '#000000', 0, '#f05237', '#000000'));
exports.ThemeMap.set('synthwave', new Theme('#e2e9ec', '#e5289e', '#2b213a', '#000000', 0, '#ef8539', '#e2e9ec'));
exports.ThemeMap.set('tokyonight', new Theme('#70a5fd', '#38bdae', '#1a1b27', '#1a1b27', 1, '#bf91f3', '#bf91f3'));
exports.ThemeMap.set('transparent', new Theme('#006AFF', '#417E87', '#00000000', '#000000', 0, '#0579C3', '#006AFF'));
exports.ThemeMap.set('vision_friendly_dark', new Theme('#ffb000', '#ffffff', '#000000', '#000000', 0, '#785ef0', '#ffb000'));
exports.ThemeMap.set('vue', new Theme('#41b883', '#000000', '#ffffff', '#e4e2e2', 1, '#41b883', '#41b883'));
exports.ThemeMap.set('yeblu', new Theme('#ffff00', '#ffffff', '#002046', '#000000', 0, '#ffff00', '#ffff00'));
exports.ThemeMap.set('zenburn', new Theme('#f0dfaf', '#dcdccc', '#3f3f3f', '#3f3f3f', 1, '#8cd0d3', '#7f9f7f'));
// Custom theme: megumi - Angel white (#c8c2c6) main + crimson red (#e63946) accent on transparent background
// title: red accent / text: angel white / background: transparent / stroke: transparent / icon: angel white / chart: red accent
exports.ThemeMap.set('megumi', new Theme('#e63946', '#c8c2c6', '#ffffff00', '#ffffff00', 0, '#c8c2c6', '#e63946'));
