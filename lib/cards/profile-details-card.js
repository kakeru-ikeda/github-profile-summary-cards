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
exports.getProfileDetailsSVGWithThemeName = exports.createProfileDetailsCard = void 0;
const theme_1 = require("../const/theme");
const icon_1 = require("../const/icon");
const js_abbreviation_number_1 = require("js-abbreviation-number");
const profile_details_1 = require("../github-api/profile-details");
const contributions_by_year_1 = require("../github-api/contributions-by-year");
const profile_details_card_1 = require("../templates/profile-details-card");
const file_writer_1 = require("../utils/file-writer");
/**
 * Creates a Profile Details Card SVG.
 *
 * @param {string} username - The GitHub username.
 * @param {string} token - The GitHub API token.
 * @return {Promise<void>}
 */
const createProfileDetailsCard = function (username, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileDetailsData = yield getProfileDetailsData(username, token);
        for (const themeName of theme_1.ThemeMap.keys()) {
            const title = profileDetailsData[0].name == null ? `${username}` : `${username} (${profileDetailsData[0].name})`;
            const svgString = getProfileDetailsSVG(title, profileDetailsData[0].contributions, profileDetailsData[1], themeName);
            // output to folder, use 0- prefix for sort in preview
            (0, file_writer_1.writeSVG)(themeName, '0-profile-details', svgString);
        }
    });
};
exports.createProfileDetailsCard = createProfileDetailsCard;
/**
 * Generates the SVG for the Profile Details Card.
 *
 * @param {string} username - The GitHub username.
 * @param {string} themeName - The card theme.
 * @param {string} token - The GitHub API token.
 * @return {Promise<string>} The SVG string.
 */
const getProfileDetailsSVGWithThemeName = function (username, themeName, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!theme_1.ThemeMap.has(themeName))
            throw new Error('Theme does not exist');
        const profileDetailsData = yield getProfileDetailsData(username, token);
        const title = profileDetailsData[0].name == null ? `${username}` : `${username} (${profileDetailsData[0].name})`;
        return getProfileDetailsSVG(title, profileDetailsData[0].contributions, profileDetailsData[1], themeName);
    });
};
exports.getProfileDetailsSVGWithThemeName = getProfileDetailsSVGWithThemeName;
const getProfileDetailsSVG = function (title, contributionsData, userDetails, themeName) {
    const svgString = (0, profile_details_card_1.createDetailCard)(`${title}`, userDetails, contributionsData, theme_1.ThemeMap.get(themeName));
    return svgString;
};
const getProfileDateJoined = function (profileDetails) {
    const s = (unit) => {
        return unit === 1 ? '' : 's';
    };
    const now = Date.now();
    const created = new Date(profileDetails.createdAt);
    const diff = new Date(now - created.getTime());
    const years = diff.getUTCFullYear() - new Date(0).getUTCFullYear();
    const months = diff.getUTCMonth() - new Date(0).getUTCMonth();
    const days = diff.getUTCDate() - new Date(0).getUTCDate();
    return years
        ? `${years} year${s(years)} ago`
        : months
            ? `${months} month${s(months)} ago`
            : `${days} day${s(days)} ago`;
};
const getProfileDetailsData = function (username, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileDetails = yield (0, profile_details_1.getProfileDetails)(username, token);
        let totalContributions = 0;
        if (process.env.VERCEL) {
            // If running on vercel, we only calculate for last 1 year to avoid hobby timeout limit
            // Sort years descending to ensure we get the latest
            profileDetails.contributionYears.sort((a, b) => b - a);
            const latestYear = profileDetails.contributionYears[0];
            if (latestYear !== undefined) {
                profileDetails.contributionYears = [latestYear];
                totalContributions += (yield (0, contributions_by_year_1.getContributionByYear)(username, latestYear, token)).totalContributions;
            }
        }
        else {
            for (const year of profileDetails.contributionYears) {
                totalContributions += (yield (0, contributions_by_year_1.getContributionByYear)(username, year, token)).totalContributions;
            }
        }
        const userDetails = [
            // If running on vercel, we only display for last 1 year contributions count
            !process.env.VERCEL
                ? {
                    index: 0,
                    icon: icon_1.Icon.GITHUB,
                    name: 'Contributions',
                    value: `${(0, js_abbreviation_number_1.abbreviateNumber)(totalContributions, 2)} Contributions on GitHub`
                }
                : {
                    index: 0,
                    icon: icon_1.Icon.GITHUB,
                    name: 'Contributions',
                    value: `${(0, js_abbreviation_number_1.abbreviateNumber)(totalContributions, 2)} Contributions in ${profileDetails.contributionYears[0]}`
                },
            {
                index: 1,
                icon: icon_1.Icon.REPOS,
                name: 'Public Repos',
                value: `${(0, js_abbreviation_number_1.abbreviateNumber)(profileDetails.totalPublicRepos, 2)} Public Repos`
            },
            {
                index: 2,
                icon: icon_1.Icon.CLOCK,
                name: 'JoinedAt',
                value: `Joined GitHub ${getProfileDateJoined(profileDetails)}`
            }
        ];
        // hard code here, cuz I'm lazy
        if (profileDetails.email) {
            userDetails.push({
                index: 3,
                icon: icon_1.Icon.EMAIL,
                name: 'Email',
                value: profileDetails['email']
            });
        }
        else if (profileDetails.company) {
            userDetails.push({
                index: 3,
                icon: icon_1.Icon.COMPANY,
                name: 'Company',
                value: profileDetails['company']
            });
        }
        else if (profileDetails.location) {
            userDetails.push({
                index: 3,
                icon: icon_1.Icon.LOCATION,
                name: 'Location',
                value: profileDetails['location']
            });
        }
        return [profileDetails, userDetails];
    });
};
