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
exports.getReposPerLanguageSVGWithThemeName = exports.createReposPerLanguageCard = void 0;
const theme_1 = require("../const/theme");
const repos_per_language_1 = require("../github-api/repos-per-language");
const donut_chart_card_1 = require("../templates/donut-chart-card");
const file_writer_1 = require("../utils/file-writer");
const createReposPerLanguageCard = function (username, exclude, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const langData = yield getRepoLanguageData(username, exclude, token);
        for (const themeName of theme_1.ThemeMap.keys()) {
            const svgString = getReposPerLanguageSVG(langData, themeName);
            // output to folder, use 1- prefix for sort in preview
            (0, file_writer_1.writeSVG)(themeName, '1-repos-per-language', svgString);
        }
    });
};
exports.createReposPerLanguageCard = createReposPerLanguageCard;
const getReposPerLanguageSVGWithThemeName = function (username, themeName, exclude, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!theme_1.ThemeMap.has(themeName))
            throw new Error('Theme does not exist');
        const langData = yield getRepoLanguageData(username, exclude, token);
        return getReposPerLanguageSVG(langData, themeName);
    });
};
exports.getReposPerLanguageSVGWithThemeName = getReposPerLanguageSVGWithThemeName;
const getReposPerLanguageSVG = function (langData, themeName) {
    const svgString = (0, donut_chart_card_1.createDonutChartCard)('Top Languages by Repo', langData, theme_1.ThemeMap.get(themeName));
    return svgString;
};
const getRepoLanguageData = function (username, exclude, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const repoLanguages = yield (0, repos_per_language_1.getRepoLanguages)(username, exclude, token);
        let langData = [];
        // make a pie data
        for (const [key, value] of repoLanguages.getLanguageMap()) {
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
