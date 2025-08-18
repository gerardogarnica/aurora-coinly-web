export interface IdentityToken {
  accessToken: string;
  accessTokenExpiresOn: Date;
  refreshToken: string;
  refreshTokenExpiresOn: Date;
}