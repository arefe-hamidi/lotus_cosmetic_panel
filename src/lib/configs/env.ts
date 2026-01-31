/**
 * Centralized env config. Use process.env in Next.js; add validation if needed.
 */
export const env = {
  get AUTH_AZURE_AD_B2C_ID(): string | undefined {
    return process.env.AUTH_AZURE_AD_B2C_ID;
  },
  get AUTH_AZURE_AD_B2C_SECRET(): string | undefined {
    return process.env.AUTH_AZURE_AD_B2C_SECRET;
  },
  get AUTH_AZURE_AD_B2C_TENANT_ID(): string | undefined {
    return process.env.AUTH_AZURE_AD_B2C_TENANT_ID;
  },
  get AUTH_AZURE_AD_B2C_AUTHORIZE(): string | undefined {
    return process.env.AUTH_AZURE_AD_B2C_AUTHORIZE;
  },
} as const;
