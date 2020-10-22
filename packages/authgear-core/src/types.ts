import { BaseContainer } from "./container";
import { BaseAPIClient } from "./client";

/**
 * @internal
 */
export interface _ByteArray {
  [index: number]: number;
  length: number;
}

/**
 * @public
 */
export interface UserInfo {
  sub: string;
  isVerified: boolean;
  isAnonymous: boolean;
}

/**
 * Auth UI anonymous user promotion options
 *
 * @public
 */
export interface PromoteOptions {
  /**
   * Redirect uri. Redirection URI to which the response will be sent after authorization.
   */
  redirectURI: string;
  /**
   * OAuth 2.0 state value.
   */
  state?: string;
  /**
   * UI locale tags
   */
  uiLocales?: string[];
}

/**
 * Auth UI authorization options
 *
 * @public
 */
export interface AuthorizeOptions {
  /**
   * Redirect uri. Redirection URI to which the response will be sent after authorization.
   */
  redirectURI: string;
  /**
   * OAuth 2.0 state value.
   */
  state?: string;
  /**
   * OIDC prompt parameter.
   */
  prompt?: string;
  /**
   * OIDC login hint parameter
   */
  loginHint?: string;
  /**
   * UI locale tags
   */
  uiLocales?: string[];
}

/**
 * Result of authorization.
 *
 * @public
 */
export interface AuthorizeResult {
  /**
   * OAuth 2.0 state value.
   */
  state?: string;
  /**
   * UserInfo.
   */
  userInfo: UserInfo;
}

/**
 * @internal
 */
export interface _APIClientDelegate {
  /**
   * Called by the API client to retrieve the access token to construct HTTP request.
   *
   * @internal
   */
  getAccessToken(): string | undefined;

  /**
   * Called by the API Client before sending HTTP request.
   * If true is returned, refreshAccessToken() is then called.
   *
   * @internal
   */
  shouldRefreshAccessToken(): boolean;

  /**
   * Called by the API client to refresh the access token.
   *
   * @internal
   */
  refreshAccessToken(): Promise<void>;
}

/**
 * @public
 */
export interface ContainerDelegate {
  /**
   * Called when the server rejects the refresh token.
   * When this function is called, the session is not cleared yet.
   *
   * @public
   */
  onRefreshTokenExpired(): Promise<void>;
}

/**
 * @public
 */
export function decodeUserInfo(r: any): UserInfo {
  return {
    sub: r["sub"],
    isVerified: r["https://authgear.com/claims/user/is_verified"] ?? false,
    isAnonymous: r["https://authgear.com/claims/user/is_anonymous"] ?? false,
  };
}

/**
 * @public
 */
export interface ChallengeResponse {
  token: string;
  expire_at: string;
}

/**
 * @public
 */
export interface ContainerStorage {
  setRefreshToken(namespace: string, refreshToken: string): Promise<void>;
  setOIDCCodeVerifier(namespace: string, code: string): Promise<void>;
  setAnonymousKeyID(namespace: string, kid: string): Promise<void>;

  getRefreshToken(namespace: string): Promise<string | null>;
  getOIDCCodeVerifier(namespace: string): Promise<string | null>;
  getAnonymousKeyID(namespace: string): Promise<string | null>;

  delRefreshToken(namespace: string): Promise<void>;
  delOIDCCodeVerifier(namespace: string): Promise<void>;
  delAnonymousKeyID(namespace: string): Promise<void>;
}

/**
 * @public
 */
export interface StorageDriver {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
}

/**
 * @public
 */
export interface ContainerOptions<T> {
  name?: string;
  apiClient?: T;
  storage?: ContainerStorage;
}

/**
 * OAuthError represents the oauth error response.
 * https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 *
 * @public
 */
export interface OAuthError {
  state?: string;
  error: string;
  error_description?: string;
  error_uri?: string;
}

/**
 * @internal
 */
export interface _OIDCConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  revocation_endpoint: string;
  end_session_endpoint: string;
}

/**
 * @internal
 */
export interface _OIDCTokenRequest {
  grant_type:
    | "authorization_code"
    | "refresh_token"
    | "urn:authgear:params:oauth:grant-type:anonymous-request";
  client_id: string;
  redirect_uri?: string;
  code?: string;
  code_verifier?: string;
  refresh_token?: string;
  jwt?: string;
}

/**
 * @internal
 */
export interface _OIDCTokenResponse {
  id_token: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

/**
 * Possible values: "LoggedIn" | "NoSession" | "Unknown"
 *
 * The state of the user session in authgear. An authgear instance is in one and only one specific
 * state at any given point in time.
 *
 * For example, the session state of an authgear instance that is just constructed always has
 * "Unknown". After a call to [Authgear.configure], the session state would be
 * "LoggedIn" if a previous session is found, or "NoSession" if there is
 * no such sessions.
 *
 * @public
 */
export type SessionState = "LoggedIn" | "NoSession" | "Unknown";

/**
 * Possible values: "NoToken" | "FoundToken" | "Authorized" | "Logout" | "Expired"
 *
 * The reason that [SessionState] is changed in a user session represented by an authgear instance.
 *
 * These reasons can be thought of as the transition of a [SessionState], which is described as
 * follows:
 * ```
 *                                                      Logout/Expiry
 *                                             +-----------------------------------------+
 *                                             v                                         |
 *    State: Unknown ----- NoToken ----> State: NoSession ---- Authorized -----> State: LoggedIn
 *      |                                                                                ^
 *      +--------------------------------------------------------------------------------+
 *                                         FoundToken
 * ```
 *
 * These transitions and states can be used in [OnSessionStateChangedListener]
 * to examine the current state of authgear.
 *
 * The same can be done for login. A "LoggedIn" with "Authorized" means the
 * user had just logged in, or if the reason is "FoundToken" instead, a
 * previous session of the user is found.
 *
 * @public
 */
export type SessionStateChangeReason =
  | "NoToken"
  | "FoundToken"
  | "Authorized"
  | "Logout"
  | "Expired";

/**
 * [OnSessionStateChangedListener] can be used to listen to state changes and inspect
 * the reason of the state change.
 *
 * For example, to check if a user is logged out, check if the new state is "NoSession"
 * and reason "Logout"
 *
 * To check if the session is expired, check if the new state is "NoSession" and
 * reason "Expired"
 *
 * @public
 */
export interface OnSessionStateChangedListener {
  onSessionStateChanged: <T extends BaseAPIClient>(
    container: BaseContainer<T>,
    reason: SessionStateChangeReason
  ) => void;
}
