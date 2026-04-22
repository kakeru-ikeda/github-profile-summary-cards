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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContributionByYear = exports.ConrtibutionByYear = void 0;
const request_1 = __importDefault(require("../utils/request"));
class ConrtibutionByYear {
    constructor(year, totalCommitContributions, totalContributions) {
        this.year = year;
        this.totalCommitContributions = totalCommitContributions;
        this.totalContributions = totalContributions;
    }
}
exports.ConrtibutionByYear = ConrtibutionByYear;
const fetcher = (token, variables, year) => {
    return (0, request_1.default)({
        Authorization: `bearer ${token}`
    }, {
        query: `
      query ContributionsByYear($login: String!) {
        user(login: $login) {
            ${year
            ? `contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {`
            : 'contributionsCollection {'}
                    totalCommitContributions
                    contributionCalendar {
                        totalContributions
                    }
                }
            }
        }
      `,
        variables
    });
};
function getContributionByYear(username, year, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetcher(token, {
            login: username
        }, year);
        if (res.data.errors) {
            throw Error(res.data.errors[0].message || 'GetContributionByYear failed');
        }
        const user = res.data.data.user;
        const result = new ConrtibutionByYear(year, user.contributionsCollection.totalCommitContributions, user.contributionsCollection.contributionCalendar.totalContributions);
        return result;
    });
}
exports.getContributionByYear = getContributionByYear;
