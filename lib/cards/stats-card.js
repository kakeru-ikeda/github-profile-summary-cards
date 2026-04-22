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
exports.getStatsSVGWithThemeName = exports.createStatsCard = void 0;
const theme_1 = require("../const/theme");
const icon_1 = require("../const/icon");
const js_abbreviation_number_1 = require("js-abbreviation-number");
const profile_details_1 = require("../github-api/profile-details");
const contributions_by_year_1 = require("../github-api/contributions-by-year");
const stats_card_1 = require("../templates/stats-card");
const file_writer_1 = require("../utils/file-writer");
const createStatsCard = function (username, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const statsData = yield getStatsData(username, token);
        for (const themeName of theme_1.ThemeMap.keys()) {
            const svgString = getStatsSVG(statsData, themeName);
            // output to folder, use 3- prefix for sort in preview
            (0, file_writer_1.writeSVG)(themeName, '3-stats', svgString);
        }
    });
};
exports.createStatsCard = createStatsCard;
const getStatsSVGWithThemeName = function (username, themeName, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!theme_1.ThemeMap.has(themeName))
            throw new Error('Theme does not exist');
        const statsData = yield getStatsData(username, token);
        return getStatsSVG(statsData, themeName);
    });
};
exports.getStatsSVGWithThemeName = getStatsSVGWithThemeName;
const getStatsSVG = function (StatsData, themeName) {
    const title = 'Stats';
    const svgString = (0, stats_card_1.createStatsCard)(`${title}`, StatsData, theme_1.ThemeMap.get(themeName));
    return svgString;
};
const getStatsData = function (username, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileDetails = yield (0, profile_details_1.getProfileDetails)(username, token);
        const totalStars = profileDetails.totalStars;
        let totalCommitContributions = 0;
        const totalPullRequestContributions = profileDetails.totalPullRequestContributions;
        const totalIssueContributions = profileDetails.totalIssueContributions;
        const totalRepositoryContributions = profileDetails.totalRepositoryContributions;
        if (process.env.VERCEL) {
            // If running on vercel, we only calculate for last 1 year to avoid Vercel timeout limit
            profileDetails.contributionYears = profileDetails.contributionYears.slice(0, 1);
            for (const year of profileDetails.contributionYears) {
                const contributions = yield (0, contributions_by_year_1.getContributionByYear)(username, year, token);
                totalCommitContributions += contributions.totalCommitContributions;
            }
        }
        else {
            for (const year of profileDetails.contributionYears) {
                const contributions = yield (0, contributions_by_year_1.getContributionByYear)(username, year, token);
                totalCommitContributions += contributions.totalCommitContributions;
            }
        }
        const statsData = [
            {
                index: 0,
                icon: icon_1.Icon.STAR,
                name: 'Total Stars:',
                value: `${(0, js_abbreviation_number_1.abbreviateNumber)(totalStars, 1)}`
            },
            // If running on vercel, we only display for last 1 year commits count
            !process.env.VERCEL
                ? {
                    index: 1,
                    icon: icon_1.Icon.COMMIT,
                    name: 'Total Commits:',
                    value: `${(0, js_abbreviation_number_1.abbreviateNumber)(totalCommitContributions, 1)}`
                }
                : {
                    index: 1,
                    icon: icon_1.Icon.COMMIT,
                    name: `${profileDetails.contributionYears[0]} Commits:`,
                    value: `${(0, js_abbreviation_number_1.abbreviateNumber)(totalCommitContributions, 1)}`
                },
            {
                index: 2,
                icon: icon_1.Icon.PULL_REQUEST,
                name: 'Total PRs:',
                value: `${(0, js_abbreviation_number_1.abbreviateNumber)(totalPullRequestContributions, 1)}`
            },
            {
                index: 3,
                icon: icon_1.Icon.ISSUE,
                name: 'Total Issues:',
                value: `${(0, js_abbreviation_number_1.abbreviateNumber)(totalIssueContributions, 1)}`
            },
            {
                index: 4,
                icon: icon_1.Icon.REPOS,
                name: 'Contributed to:',
                value: `${(0, js_abbreviation_number_1.abbreviateNumber)(totalRepositoryContributions, 1)}`
            }
        ];
        return statsData;
    });
};
