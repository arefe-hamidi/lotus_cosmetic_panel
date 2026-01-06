# `.env` Variables

The .env file is required for the project to run properly, but it is placed in .gitignore for security reasons and you should not change this rule.

In this project, only one .env file with the following values is sufficient for execution.

## Auth JS

Values related to Auth JS settings:

### AUTH_SECRET

Encryption key for generating and validating JWT tokens in authentication. Used in the `getJwtToken` method and NextAuth configuration.

### AUTH_AZURE_AD_B2C_ID

Azure AD B2C client ID for user authentication.

### AUTH_AZURE_AD_B2C_SECRET

Azure AD B2C client secret for user authentication.

### AUTH_AZURE_AD_B2C_ISSUER

Issuer URL for Azure AD B2C tokens.

### AUTH_AZURE_AD_B2C_AUTHORIZE

Azure AD B2C authorization endpoint URL for obtaining authentication codes.

### AUTH_URL

Authentication endpoint URL for the project. Used in Docker and server configuration to set the authentication path, .e.g: "http://localhost:3031/api/auth"

## API settings

#### API_BASE_URL

Base URL of the main API to which server-side requests are sent. Used in `proxyFetch` and `serverProxyFetch` functions.

### AUTH_SECURE_COOKIE

Specifies whether authentication cookies are sent securely (only over HTTPS). Used in the `getJwtToken` method and NextAuth configuration.

### NEXT_PUBLIC_BASE_URL

Base URL for the client (frontend). Used in development and testing for sending requests and fetching configs, .e.g:"http://localhost:3031"

### IS_STAGING

Indicates the staging environment. Used in `lib/configs/constants.ts` to enable certain features and restrictions.

### API_SUB_KEY

Subscription key for accessing the main API. Sent in request headers as `ocp-apim-subscription-key` and used for server-side authentication.

&nbsp;

&nbsp;

[< back](/README.md)
