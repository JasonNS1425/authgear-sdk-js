import { _decodeUserInfo } from "./types";

const USER_INFO = `
{
  "sub": "sub",
  "https://authgear.com/claims/user/is_verified": true,
  "https://authgear.com/claims/user/is_anonymous": false,
  "https://authgear.com/claims/user/can_reauthenticate": true,
  "https://authgear.com/claims/user/roles": ["role_a"],

  "email": "user@example.com",
  "email_verified": true,
  "phone_number": "+85298765432",
  "phone_number_verified": true,
  "preferred_username": "user",
  "family_name": "Doe",
  "given_name": "John",
  "middle_name": "Middle",
  "name": "John Doe",
  "nickname": "John",
  "picture": "picture",
  "profile": "profile",
  "website": "website",
  "gender": "gender",
  "birthdate": "1970-01-01",
  "zoneinfo": "Etc/UTC",
  "locale": "zh-HK",
  "address": {
    "formatted": "10 Somewhere Street, Mong Kok, Kowloon, HK",
    "street_address": "10 Somewhere Street",
    "locality": "Mong Kok",
    "region": "Kowloon",
    "postal_code": "N/A",
    "country": "HK"
  },

  "custom_attributes": {
    "foobar": 42
  }
}
`;

describe("_decodeUserInfo", () => {
  it("decodes user info", () => {
    const actual = _decodeUserInfo(JSON.parse(USER_INFO));
    const expected = {
      address: {
        country: "HK",
        formatted: "10 Somewhere Street, Mong Kok, Kowloon, HK",
        locality: "Mong Kok",
        postalCode: "N/A",
        region: "Kowloon",
        streetAddress: "10 Somewhere Street",
      },
      birthdate: "1970-01-01",
      canReauthenticate: true,
      roles: ["role_a"],
      customAttributes: {
        foobar: 42,
      },
      email: "user@example.com",
      emailVerified: true,
      familyName: "Doe",
      gender: "gender",
      givenName: "John",
      isAnonymous: false,
      isVerified: true,
      locale: "zh-HK",
      middleName: "Middle",
      name: "John Doe",
      nickname: "John",
      phoneNumber: "+85298765432",
      phoneNumberVerified: true,
      picture: "picture",
      preferredUsername: "user",
      profile: "profile",
      raw: {
        address: {
          country: "HK",
          formatted: "10 Somewhere Street, Mong Kok, Kowloon, HK",
          locality: "Mong Kok",
          postal_code: "N/A",
          region: "Kowloon",
          street_address: "10 Somewhere Street",
        },
        birthdate: "1970-01-01",
        custom_attributes: {
          foobar: 42,
        },
        email: "user@example.com",
        email_verified: true,
        family_name: "Doe",
        gender: "gender",
        given_name: "John",
        "https://authgear.com/claims/user/roles": ["role_a"],
        "https://authgear.com/claims/user/can_reauthenticate": true,
        "https://authgear.com/claims/user/is_anonymous": false,
        "https://authgear.com/claims/user/is_verified": true,
        locale: "zh-HK",
        middle_name: "Middle",
        name: "John Doe",
        nickname: "John",
        phone_number: "+85298765432",
        phone_number_verified: true,
        picture: "picture",
        preferred_username: "user",
        profile: "profile",
        sub: "sub",
        website: "website",
        zoneinfo: "Etc/UTC",
      },
      sub: "sub",
      website: "website",
      zoneinfo: "Etc/UTC",
    };
    expect(expected).toEqual(actual);
  });
});
