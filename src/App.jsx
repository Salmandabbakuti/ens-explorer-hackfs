import React, { useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import { Input, Button, Card, Spin, Alert, Space } from "antd";
import "./App.css";

const graphqlClient = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens"
);

const DOMAINS_QUERY = gql`
  query domains($skip: Int, $first: Int, $where: Domain_filter) {
    domains(skip: $skip, first: $first, where: $where) {
      id
      name
      registration {
        registrationDate
        expiryDate
        registrant {
          id
        }
        cost
      }
      owner {
        id
      }
      resolvedAddress {
        id
      }
    }
  }
`;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [ensData, setEnsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDomains = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlClient.request(DOMAINS_QUERY, {
        first: 1,
        where: { name }
      });
      if (data.domains.length > 0) {
        setEnsData(data.domains[0]);
      } else {
        setEnsData(null);
        setError("No data found for the provided ENS name.");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchInput) {
      getDomains(searchInput);
    } else {
      setError("Please enter a valid ENS name.");
    }
  };

  return (
    <div className="App">
      <h1>ENS Lookup</h1>
      <div className="search-box">
        <Space>
          <Input
            size="large"
            placeholder="Enter ENS name (e.g., vitalik.eth)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
            style={{ borderRadius: "15px", width: "300px" }}
          />
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSearch}
            style={{ borderRadius: "15px" }}
          >
            Search
          </Button>
        </Space>
      </div>
      <div className="result-card">
        {error && <Alert message={error} type="error" showIcon />}
        {ensData && (
          <Card title={ensData.name}>
            <p>
              <strong>Owner:</strong> {ensData.owner.id}
            </p>
            <p>
              <strong>Registrant:</strong> {ensData.registration.registrant.id}
            </p>
            <p>
              <strong>Registration Date:</strong>{" "}
              {new Date(
                ensData.registration.registrationDate * 1000
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>Expiry Date:</strong>{" "}
              {new Date(
                ensData.registration.expiryDate * 1000
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>Resolved Address:</strong>{" "}
              {ensData.resolvedAddress ? ensData.resolvedAddress.id : "N/A"}
            </p>
            <p>
              <strong>Cost:</strong> {ensData.registration.cost}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
