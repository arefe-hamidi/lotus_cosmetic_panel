export interface iUserRole {
  id?: string;
  ipRestrictionEnabled?: boolean;
  whitelistedIpAddresses?: string[];
  [key: string]: unknown;
}
