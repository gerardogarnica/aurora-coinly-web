import { Injectable } from '@angular/core';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  accessTokenKeyName: string = 'coinly_access_token';
  refreshTokenKeyName: string = 'coinly_refresh_token';

  getKeyName(type: TokenType): string {
    return type === TokenType.Access ? this.accessTokenKeyName : this.refreshTokenKeyName;
  }

  getToken(type: TokenType): string | undefined {
    const key = this.getKeyName(type);
    return getCookie(key);
  }

  setToken(type: TokenType, token: string, expires: Date) {
    const key = this.getKeyName(type);

    setCookie(key, token, {
      expires: new Date(expires),
      path: '/',
      sameSite: 'strict'
    });
  }

  removeToken(type: TokenType) {
    const key = this.getKeyName(type);
    removeCookie(key, { path: '/' });
  }

  hasToken(type: TokenType): boolean {
    return !!this.getToken(type);
  }
}

export enum TokenType {
  Access = 'access',
  Refresh = 'refresh'
}
