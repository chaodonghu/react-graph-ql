import axios from "axios";

import { GET_ISSUES_OF_REPOSITORY, ADD_STAR, REMOVE_STAR } from "./queries";

export const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

export const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split("/");

  return axiosGitHubGraphQL.post("", {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { organization, repository, cursor },
  });
};

export const addStarToRepository = (repositoryId) => {
  return axiosGitHubGraphQL.post("", {
    query: ADD_STAR,
    variables: { repositoryId },
  });
};

export const removeStarFromRepository = (repositoryId) => {
  return axiosGitHubGraphQL.post("", {
    query: REMOVE_STAR,
    variables: { repositoryId },
  });
};
