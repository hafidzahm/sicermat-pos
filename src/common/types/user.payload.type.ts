export type UserPayload = {
  userLogin: {
    sub: string; // user id (JWT subject claim)
    username: string; // username of the user
    role: string; // role of the user (e.g., "karyawan")
    iat: number; // issued-at timestamp (epoch seconds)
    exp: number; // expiration timestamp (epoch seconds)
  };
};
