import React, { useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import {
  Input,
  Button,
  Card,
  Alert,
  Space,
  message,
  Avatar,
  Descriptions
} from "antd";
import { formatEther } from "viem";
import "./App.css";
import { CopyOutlined, ExportOutlined } from "@ant-design/icons";

const graphqlClient = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens"
);

const DOMAINS_QUERY = gql`
  query domains($skip: Int, $first: Int, $where: Domain_filter) {
    domains(skip: $skip, first: $first, where: $where) {
      id
      name
      resolver {
        contentHash
      }
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

  const getDomains = () => {
    if (!searchInput) return message.error("Please enter a valid ENS name.");
    setLoading(true);
    graphqlClient
      .request(DOMAINS_QUERY, {
        first: 1,
        where: { name: searchInput }
      })
      .then((data) => {
        if (data.domains.length > 0) {
          setEnsData(data.domains[0]);
        } else {
          setEnsData(null);
          message.error("No data found for the given ENS name.");
        }
      })
      .catch((error) => {
        console.error("Failed to get domains", error);
        message.error("Failed to get domains. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
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
            onPressEnter={getDomains}
            style={{ borderRadius: "15px", width: "300px" }}
          />
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={getDomains}
            style={{ borderRadius: "15px" }}
          >
            Search
          </Button>
        </Space>
      </div>
      <div className="result-card">
        {ensData && (
          // <Card title={ensData.name}>
          //   <p>
          //     <strong>Owner:</strong> {ensData.owner.id}
          //   </p>
          //   <p>
          //     <strong>Registrant:</strong> {ensData.registration.registrant.id}
          //   </p>
          //   <p>
          //     <strong>Registration Date:</strong>{" "}
          //     {new Date(
          //       ensData.registration.registrationDate * 1000
          //     ).toLocaleDateString()}
          //   </p>
          //   <p>
          //     <strong>Expiry Date:</strong>{" "}
          //     {new Date(
          //       ensData.registration.expiryDate * 1000
          //     ).toLocaleDateString()}
          //   </p>
          //   <p>
          //     <strong>Resolved Address:</strong>{" "}
          //     {ensData.resolvedAddress ? ensData.resolvedAddress.id : "N/A"}
          //   </p>
          //   <p>
          //     <strong>Cost:</strong> {ensData.registration.cost}
          //   </p>
          // </Card>

          <Card style={{ marginTop: "20px" }}>
            <Descriptions
              title={
                // add name and copy icon
                <Space>
                  <Avatar
                    src={`https://avatars.dicebear.com/api/avataaars/${ensData.name}.svg`}
                    style={{ marginRight: "10px" }}
                  />
                  {ensData.name}
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(ensData.name);
                      message.success("ENS name copied to clipboard.");
                    }}
                  />
                  <a
                    href={`https://app.ens.domains/${ensData.name}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExportOutlined title="View on ENS App" />
                  </a>
                </Space>
              }
              bordered
              items={[
                { label: "Owner", children: ensData.owner.id },
                {
                  label: "Registrant",
                  children: ensData.registration.registrant.id
                },
                {
                  label: "Resolved Address",
                  children: ensData.resolvedAddress
                    ? ensData.resolvedAddress.id
                    : "N/A"
                },
                {
                  label: "Registration Date",
                  children: new Date(
                    ensData.registration.registrationDate * 1000
                  ).toLocaleDateString()
                },
                {
                  label: "Expiry Date",
                  children: new Date(
                    ensData.registration.expiryDate * 1000
                  ).toLocaleDateString()
                },
                {
                  label: "Cost",
                  children: `${formatEther(ensData.registration.cost)} ETH`
                },
                {
                  label: "Content Hash",
                  children: ensData.resolver.contentHash
                }
              ]}
            />
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
