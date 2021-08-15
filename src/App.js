import React, { useState, useCallback, useEffect } from "react";

import Organization from "./Organization";
import {
  addStarToRepository,
  getIssuesOfRepository,
  removeStarFromRepository,
} from "./api";

const App = () => {
  const [path, setPath] = useState(
    "the-road-to-learn-react/the-road-to-learn-react"
  );
  const [organization, setOrganization] = useState(null);
  const [errors, setErrors] = useState(null);

  const resolveIssuesQuery = useCallback(
    (queryResult, cursor) => {
      const { data, errors } = queryResult.data;

      if (!cursor) {
        setOrganization(data?.organization);
        setErrors(errors);
        return;
      }

      const { edges: oldIssues } = organization?.repository?.issues;
      const { edges: newIssues } = data?.organization?.repository?.issues;
      const updatedIssues = [...oldIssues, ...newIssues];

      setOrganization({
        ...data.organization,
        repository: {
          ...data.organization.repository,
          issues: {
            ...data.organization.repository.issues,
            edges: updatedIssues,
          },
        },
      });
      setErrors(errors);
    },
    [organization?.repository?.issues]
  );

  const onFetchFromGitHub = useCallback((path, cursor) => {
    getIssuesOfRepository(path, cursor).then((queryResult) => {
      resolveIssuesQuery(queryResult, cursor);
      setPath(path);
    });
  }, []);

  useEffect(() => {
    onFetchFromGitHub(path, null);
  }, [onFetchFromGitHub, path]);

  const handleOnChange = useCallback(
    (event) => {
      setPath(event.target.value);
    },
    [setPath]
  );

  const handleOnSubmit = useCallback(
    (event) => {
      onFetchFromGitHub(path);
      event.preventDefault();
    },
    [onFetchFromGitHub, path]
  );

  const resolveAddStarMutation = useCallback(
    (mutationResult) => {
      const { viewerHasStarred } = mutationResult.data.data.addStar.starrable;

      const { totalCount } = organization.repository.stargazers;

      setOrganization({
        ...organization,
        repository: {
          ...organization.repository,
          viewerHasStarred,
          stargazers: {
            totalCount: totalCount + 1,
          },
        },
      });
    },
    [organization]
  );

  const resolveRemoveStarMutation = useCallback(
    (mutationResult) => {
      const {
        viewerHasStarred,
      } = mutationResult.data.data.removeStar.starrable;

      const { totalCount } = organization.repository.stargazers;

      setOrganization({
        ...organization,
        repository: {
          ...organization.repository,
          viewerHasStarred,
          stargazers: {
            totalCount: totalCount - 1,
          },
        },
      });
    },
    [organization]
  );

  const onFetchMoreIssues = useCallback(() => {
    const { endCursor } = organization.repository.issues.pageInfo;
    onFetchFromGitHub(path, endCursor);
  }, [organization?.repository?.issues?.pageInfo, path, onFetchFromGitHub]);

  const onStarRepository = useCallback(
    (repositoryId, viewerHasStarred) => {
      if (viewerHasStarred) {
        removeStarFromRepository(repositoryId).then((mutationResult) =>
          resolveRemoveStarMutation(mutationResult)
        );
      } else {
        addStarToRepository(repositoryId).then((mutationResult) =>
          resolveAddStarMutation(mutationResult)
        );
      }
    },
    [resolveAddStarMutation, resolveRemoveStarMutation]
  );

  return (
    <div>
      <h1>React GraphQL GitHub Client</h1>

      <form onSubmit={handleOnSubmit}>
        <label htmlFor="url">Show open issues for https://github.com/</label>
        <input
          id="url"
          type="text"
          value={path}
          onChange={handleOnChange}
          style={{ width: "300px" }}
        />
        <button type="submit">Search</button>
      </form>

      <hr />

      {organization ? (
        <Organization
          organization={organization}
          errors={errors}
          onFetchMoreIssues={onFetchMoreIssues}
          onStarRepository={onStarRepository}
        />
      ) : (
        <p>No information yet ...</p>
      )}
    </div>
  );
};

export default App;
