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
exports.getProfileDetails = exports.ProfileContribution = exports.ProfileDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const request_1 = __importDefault(require("../utils/request"));
class ProfileDetails {
    constructor(id, name, email, createdAt) {
        this.company = null;
        this.websiteUrl = null;
        this.twitterUsername = null;
        this.location = null;
        this.totalPublicRepos = 0;
        this.totalStars = 0;
        this.totalIssueContributions = 0;
        this.totalPullRequestContributions = 0;
        this.totalRepositoryContributions = 0;
        this.contributions = [];
        this.contributionYears = [];
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
    }
}
exports.ProfileDetails = ProfileDetails;
class ProfileContribution {
    constructor(date, count) {
        this.contributionCount = 0;
        this.date = date;
        this.contributionCount = count;
    }
}
exports.ProfileContribution = ProfileContribution;
const fetcher = (token, variables) => {
    // contain private need token permission
    // contributionsCollection default to a year ago
    return (0, request_1.default)({
        Authorization: `bearer ${token}`
    }, {
        query: `
      query UserDetails($login: String!) {
        user(login: $login) {
            id
            name
            email
            createdAt
            twitterUsername
            company
            location
            websiteUrl
            repositories(first: 100,privacy:PUBLIC, isFork: false, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
              totalCount
              nodes {
                stargazers {
                  totalCount
                }
              }
            }
            contributionsCollection {
                contributionCalendar {
                    weeks {
                        contributionDays {
                            contributionCount
                            date
                        }
                    }
                }
                contributionYears
            }
            repositoriesContributedTo(first: 1,includeUserRepositories:true, privacy:PUBLIC, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
                totalCount
            }
            pullRequests(first: 1) {
                totalCount
            }
            issues(first: 1) {
                totalCount
            }
        }
      }

      `,
        variables
    });
};
const fetchPublicRepoCount = (username, token) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get(`https://api.github.com/users/${username}`, {
        headers: {
            Authorization: `bearer ${token}`
        }
    });
    return res.data.public_repos;
});
function getProfileDetails(username, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const [res, publicRepoCount] = yield Promise.all([
            fetcher(token, {
                login: username
            }),
            fetchPublicRepoCount(username, token)
        ]);
        if (res.data.errors) {
            throw Error(res.data.errors[0].message || 'GetProfileDetails failed');
        }
        const user = res.data.data.user;
        const profileDetails = new ProfileDetails(user.id, user.name, user.email, user.createdAt);
        profileDetails.totalPublicRepos = publicRepoCount;
        profileDetails.totalStars = user.repositories.nodes.reduce((stars, curr) => {
            return stars + curr.stargazers.totalCount;
        }, 0);
        profileDetails.websiteUrl = user.websiteUrl;
        profileDetails.totalIssueContributions = user.issues.totalCount;
        profileDetails.totalPullRequestContributions = user.pullRequests.totalCount;
        profileDetails.totalRepositoryContributions = user.repositoriesContributedTo.totalCount;
        profileDetails.company = user.company;
        profileDetails.location = user.location;
        profileDetails.twitterUsername = user.twitterUsername;
        profileDetails.contributionYears = user.contributionsCollection.contributionYears;
        // contributions into array
        for (const week of user.contributionsCollection.contributionCalendar.weeks) {
            for (const day of week.contributionDays) {
                profileDetails.contributions.push(new ProfileContribution(new Date(day.date), day.contributionCount));
            }
        }
        return profileDetails;
    });
}
exports.getProfileDetails = getProfileDetails;
