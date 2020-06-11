import { User, AuthResponse } from "./types";

/**
 * @internal
 */
export function _decodeUser(u: any): User {
  const id = u.id;
  const createdAt = new Date(u.created_at);
  const lastLoginAt = new Date(u.last_login_at);
  const isVerified = u.is_verified;
  const isManuallyVerified = u.is_manually_verified;
  const isDisabled = u.is_disabled;
  const isAnonymous = u.is_anonymous;
  const metadata = u.metadata;
  return {
    id,
    createdAt,
    lastLoginAt,
    isManuallyVerified,
    isVerified,
    isDisabled,
    isAnonymous,
    metadata,
  };
}

/**
 * @internal
 */
export function _encodeUser(u: User): unknown {
  const created_at = u.createdAt.toISOString();
  const last_login_at = u.lastLoginAt.toISOString();
  return {
    id: u.id,
    created_at,
    last_login_at,
    is_manually_verified: u.isManuallyVerified,
    is_verified: u.isVerified,
    is_disabled: u.isDisabled,
    is_anonymous: u.isAnonymous,
    metadata: u.metadata,
  };
}

/**
 * @internal
 */
export function _decodeAuthResponseFromOIDCUserinfo(u: any): AuthResponse {
  const { sub, skygear_user, skygear_session_id } = u;

  if (!skygear_user) {
    throw new Error("missing skygear_user in userinfo");
  }

  const user = _decodeUser(skygear_user);
  user.id = sub;

  const response: AuthResponse = {
    user: user,
  };

  if (skygear_session_id) {
    response.sessionID = skygear_session_id;
  }

  return response;
}
