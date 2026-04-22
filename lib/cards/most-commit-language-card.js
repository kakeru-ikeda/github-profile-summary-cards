"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitsLanguageSVGWithThemeName = exports.createCommitsPerLanguageCard = void 0;
const theme_1 = require("../const/theme");
const commits_per_language_1 = require("../github-api/commits-per-language");
const donut_chart_card_1 = require("../templates/donut-chart-card");
const file_writer_1 = require("../utils/file-writer");
const createCommitsPerLanguageCard = function (username, exclude, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const statsData = yield getCommitsLanguageData(username, exclude, token);
        for (const themeName of theme_1.ThemeMap.keys()) {
            const svgString = getCommitsLanguageSVG(statsData, themeName);
            // output to folder, use 2- prefix for sort in preview
            (0, file_writer_1.writeSVG)(themeName, '2-most-commit-language', svgString);
        }
    });
};
exports.createCommitsPerLanguageCard = createCommitsPerLanguageCard;
const getCommitsLanguageSVGWithThemeName = function (username, themeName, exclude, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!theme_1.ThemeMap.has(themeName))
            throw new Error('Theme does not exist');
        const langData = yield getCommitsLanguageData(username, exclude, token);
        return getCommitsLanguageSVG(langData, themeName);
    });
};
exports.getCommitsLanguageSVGWithThemeName = getCommitsLanguageSVGWithThemeName;
const getCommitsLanguageSVG = function (langData, themeName) {
    if (langData.length == 0) {
        langData.push({
            name: 'There are no',
            value: 1,
            color: '#586e75'
        });
        langData.push({
            name: 'any commits',
            value: 1,
            color: '#586e75'
        });
        langData.push({
            name: 'in the last year',
            value: 1,
            color: '#586e75'
        });
    }
    const svgString = (0, donut_chart_card_1.createDonutChartCard)('Top Languages by Commit', langData, theme_1.ThemeMap.get(themeName));
    return svgString;
};
const getCommitsLanguageData = function (username, exclude, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const commitLanguages = yield (0, commits_per_language_1.getCommitLanguage)(username, exclude, token);
        let langData = [];
        // make a pie data
        for (const [key, value] of commitLanguages.getLanguageMap()) {
            langData.push({
                name: key,
                value: value.count,
                color: value.color
            });
        }
        langData.sort(function (a, b) {
            return b.value - a.value;
        });
        langData = langData.slice(0, 5); // get top 5
        return langData;
    });
};
