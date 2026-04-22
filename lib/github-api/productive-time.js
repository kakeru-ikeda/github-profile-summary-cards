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
exports.getProductiveTime = exports.ProfuctiveTime = void 0;
const request_1 = __importDefault(require("../utils/request"));
class ProfuctiveTime {
    constructor() {
        this.productiveDate = [];
    }
    addProductiveDate(date) {
        this.productiveDate.push(date);
    }
}
exports.ProfuctiveTime = ProfuctiveTime;
const userIdFetcher = (token, variables) => {
    return (0, request_1.default)({
        Authorization: `bearer ${token}`
    }, {
        query: `
      query getUserId($login: String!) {
        user(login: $login) {
            id
        }
      }
     `,
        variables
    });
};
// We use commit datetime to calculate productive time
const fetcher = (token, variables) => {
    return (0, request_1.default)({
        Authorization: `bearer ${token}`
    }, {
        query: `
      query ProductiveTime($login: String!,$userId: ID!,$until: GitTimestamp!,,$since: GitTimestamp!) {
        user(login: $login) {
          contributionsCollection{
            commitContributionsByRepository(maxRepositories:50) {
              repository {
                defaultBranchRef {
                  target {
                    ... on Commit {
                      history(first: 50,since: $since,until: $until,author:{id:$userId}) {
                        edges {
                          node {
                            message
                            author{
                              email
                            }
                            committedDate
                          }
                        }
                      }
                    }
                  }
                }
                name
              }
            }
          }
        }
      }
     `,
        variables
    });
};
// get productive time
function getProductiveTime(username, until, since, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const userIdResponse = yield userIdFetcher(token, {
            login: username
        });
        if (userIdResponse.data.errors) {
            throw Error(userIdResponse.data.errors[0].message || 'GetProductiveTime failed');
        }
        const userId = userIdResponse.data.data.user.id;
        const res = yield fetcher(token, {
            login: username,
            userId: userId,
            until: until,
            since: since
        });
        if (res.data.errors) {
            throw Error(res.data.errors[0].message || 'GetProductiveTime failed');
        }
        const productiveTime = new ProfuctiveTime();
        res.data.data.user.contributionsCollection.commitContributionsByRepository.forEach((node) => {
            if (node.repository.defaultBranchRef != null) {
                node.repository.defaultBranchRef.target.history.edges.forEach(node => {
                    productiveTime.addProductiveDate(node.node.committedDate);
                });
            }
        });
        return productiveTime;
    });
}
exports.getProductiveTime = getProductiveTime;
