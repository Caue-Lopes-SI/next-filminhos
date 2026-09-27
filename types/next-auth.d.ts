import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    token: string;
    initials: string;
  }
  interface Session {
    user: User & {
      id: string;
      token: string;
      initials: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    token: string;
    initials: string;
  }
}
