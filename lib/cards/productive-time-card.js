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
exports.getProductiveTimeSVGWithThemeName = exports.createProductiveTimeCard = void 0;
const theme_1 = require("../const/theme");
const productive_time_1 = require("../github-api/productive-time");
const productive_time_card_1 = require("../templates/productive-time-card");
const file_writer_1 = require("../utils/file-writer");
const createProductiveTimeCard = function (username, utcOffset, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const productiveTimeData = yield getProductiveTimeData(username, utcOffset, token);
        for (const themeName of theme_1.ThemeMap.keys()) {
            const svgString = getProductiveTimeSVG(productiveTimeData, themeName, utcOffset);
            // output to folder, use 4- prefix for sort in preview
            (0, file_writer_1.writeSVG)(themeName, '4-productive-time', svgString);
        }
    });
};
exports.createProductiveTimeCard = createProductiveTimeCard;
const getProductiveTimeSVGWithThemeName = function (username, themeName, utcOffset, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!theme_1.ThemeMap.has(themeName))
            throw new Error('Theme does not exist');
        const productiveTimeData = yield getProductiveTimeData(username, utcOffset, token);
        return getProductiveTimeSVG(productiveTimeData, themeName, utcOffset);
    });
};
exports.getProductiveTimeSVGWithThemeName = getProductiveTimeSVGWithThemeName;
const getProductiveTimeSVG = function (productiveTimeData, themeName, utcOffset) {
    const svgString = (0, productive_time_card_1.createProductiveCard)(productiveTimeData, theme_1.ThemeMap.get(themeName), utcOffset);
    return svgString;
};
const adjustOffset = function (offset, RoundRobin) {
    if (offset % 1 == 0) {
        return offset;
        // offset % 1 should be 0.3 or 0.7 but its js and it gives 0.29999 or -0.299999 thats why this frankenstein
    }
    else if ((offset % 1 > 0.29 && offset % 1 < 0.31) || (offset % 1 < -0.29 && offset % 1 > -0.31)) {
        // toggle up and down between hour
        RoundRobin.offset = (RoundRobin.offset + 1) % 2;
        return RoundRobin.offset === 0 ? Math.floor(offset) : Math.ceil(offset);
    }
    else if ((offset % 1 > 0.44 && offset % 1 < 0.46) || (offset % 1 < -0.44 && offset % 1 > -0.45)) {
        // distrubute 1 : 3 ratio for 0.45 utc time
        RoundRobin.offset = (RoundRobin.offset + 1) % 4;
        return RoundRobin.offset === 0 ? Math.floor(offset) : Math.ceil(offset);
    }
    else {
        // flood down , if utc is given right it will never be executed
        return Math.floor(offset);
    }
};
const getProductiveTimeData = function (username, utcOffset, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const until = new Date();
        const since = new Date();
        since.setFullYear(since.getFullYear() - 1);
        const productiveTime = yield (0, productive_time_1.getProductiveTime)(username, until.toISOString(), since.toISOString(), token);
        // process productiveTime
        const chartData = new Array(24);
        chartData.fill(0);
        const roundRobin = {
            offset: 0
        };
        for (const time of productiveTime.productiveDate) {
            const hour = new Date(time).getUTCHours(); // We use UTC+0 here
            const afterOffset = adjustOffset(Number(hour) + Number(utcOffset), roundRobin); // Add offset to hour
            // convert afterOffset to 0-23
            if (afterOffset < 0) {
                // if afterOffset is negative, we need to add 24 to get the correct hour
                chartData[24 + afterOffset] += 1;
            }
            else if (afterOffset > 23) {
                // if afterOffset is greater than 23, we need to subtract 24 to get the correct hour
                chartData[afterOffset - 24] += 1;
            }
            else {
                // if afterOffset is between 0 and 23, we can use it as the hour
                chartData[afterOffset] += 1;
            }
        }
        return chartData;
    });
};
