import { QlikService } from './qlik';

interface QsInfo {
  host: string;
  port: number;
  vp?: string;
}

interface UserInfo {
  userId: string;
  userDirectory: string;
}

interface CookieSettings {
  ttl: number;
  path: string;
  clearInvalid: boolean;
  sameSite: string;
  secure: boolean;
  httpOnly: boolean;
  domain: string;
}

interface Cookie {
  name: string;
  settings: CookieSettings;
}

interface AuthenticationPayload {
  qsInfo: QsInfo;
  userInfo: UserInfo;
  qCookie: Cookie;
}

class QlikAuthService {
  async authenticate(payload: AuthenticationPayload): Promise<string> {
    const response = await QlikService.getApi().post(
      `/qps/session/authentication`,
      payload
    );

    const sessionId = response.data;

    return String(sessionId);
  }
}

export const qlikAuthService = new QlikAuthService();
