import axios from 'axios';
import request from '../utils/request';

export class ProfileDetails {
    id: number; // user id
    name: string;
    email: string;
    createdAt: string;
    company: string | null = null;
    websiteUrl: string | null = null;
    twitterUsername: string | null = null;
    location: string | null = null;
    totalPublicRepos: number = 0;
    totalStars: number = 0;
    totalIssueContributions: number = 0;
    totalPullRequestContributions: number = 0;
    totalRepositoryContributions: number = 0;
    contributions: ProfileContribution[] = [];
    contributionYears: number[] = [];
    constructor(id: number, name: string, email: string, createdAt: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
    }
}

export class ProfileContribution {
    contributionCount: number = 0;
    date: Date;
    constructor(date: Date, count: number) {
        this.date = date;
        this.contributionCount = count;
    }
}

const fetcher = (token: string, variables: any) => {
    // contain private need token permission
    // contributionsCollection default to a year ago
    return request(
        {
            Authorization: `bearer ${token}`
        },
        {
            query: `
      query UserDetails($login: String!) {
        user(login: $login) {
            id
            name
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
        }
    );
};

// User.email is non-null in the GraphQL schema and requires the user:email/read:user scope,
// so a token without it (e.g. the Actions GITHUB_TOKEN) nullifies the whole user object.
// The REST user endpoint exposes the same public email without any extra scope.
const fetchPublicProfile = async (username: string, token: string): Promise<{publicRepos: number; email: string}> => {
    const res = await axios.get(`https://api.github.com/users/${username}`, {
        headers: {
            Authorization: `bearer ${token}`
        }
    });
    return {publicRepos: res.data.public_repos, email: res.data.email ?? ''};
};

export async function getProfileDetails(username: string, token: string): Promise<ProfileDetails> {
    const [res, publicProfile] = await Promise.all([
        fetcher(token, {
            login: username
        }),
        fetchPublicProfile(username, token)
    ]);

    if (res.data.errors) {
        // Include the field path: scope-restricted fields are non-null in the schema,
        // so a single denied field nullifies the whole user object.
        const detail = res.data.errors
            .map((e: {message?: string; path?: string[]}) => `${(e.path ?? []).join('.')}: ${e.message ?? ''}`)
            .join(' | ');
        throw Error(detail.trim() ? detail : 'GetProfileDetails failed');
    }

    const user = res.data.data.user;
    const profileDetails = new ProfileDetails(user.id, user.name, publicProfile.email, user.createdAt);
    profileDetails.totalPublicRepos = publicProfile.publicRepos;
    profileDetails.totalStars = user.repositories.nodes.reduce(
        (stars: number, curr: {stargazers: {totalCount: number}}) => {
            return stars + curr.stargazers.totalCount;
        },
        0
    );
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
}
