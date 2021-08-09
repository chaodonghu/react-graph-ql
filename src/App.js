import { useState, useCallback, useEffect } from "react";
import axios from "axios";
const TITLE = "React GraphQL GitHub Client";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const GET_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
    }
  }
`;

const App = () => {
  const [path, setPath] = useState(
    "the-road-to-learn-react/the-road-to-learn-react"
  );
  const [organization, setOrganization] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    axiosGitHubGraphQL.post("", { query: GET_ORGANIZATION }).then((result) => {
      setOrganization(result.data.data.organization);
      setErrors(result.data.errors);
    });
  }, []);

  const handleOnChange = useCallback((event) => {
    setPath(event.target.value);
  }, []);

  const handleOnSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <div>
      <h1>{TITLE}</h1>
      <form onSubmit={handleOnSubmit}>
        <label htmlFor="url">Show open issues for https://github.com</label>
        <input
          id="url"
          type="text"
          onChange={handleOnChange}
          style={{ width: "300px" }}
        />
        <button type="submit">Search</button>
      </form>
      <hr />
    </div>
  );
};

export default App;
