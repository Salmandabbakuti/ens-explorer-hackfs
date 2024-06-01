# ENS Explorer

ENS Explorer allows users to search for ENS (Ethereum Name Service) names and retrieve comprehensive details about each domain. This includes information such as the owner, registrant, addresses, registration date, expiry date, and price. The project is built using React.js for the frontend, hosted on Fleek, and utilizes IPFS for decentralized storage.

## Features

- Search for ENS names and retrieve detailed information.

- Decentralized Hosting: The website is deployed on Fleek and stored on IPFS for enhanced security and reliability.

- ENS Integration: Accessible via the .eth domain with the contenthash record set to the deployed CID.

## Getting Started

```bash

npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

** Deployed version: [https://salmandev.eth.limo/](https://salmandev.eth.limo/) **

## Deployment

### Deploying to Fleek and link to ENS .eth domain

1. Sign up for a Fleek account and create a new site.

2. Connect your GitHub repository to Fleek.

3. Set the build command and publish directory according to your project.

4. Deploy the site and copy the generated CID.

5. Update the contenthash record of your ENS domain to point to this CID. This can be done using the ENS App or directly from fleek domain management settings.

6. Ensure site is accessible via the `[your-ens-name].eth.limo` gateway

## License

This project is open-source and available under the [MIT License](LICENSE).
