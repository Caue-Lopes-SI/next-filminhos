import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch("https://tarefaapi.onrender.com/api/v1/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const json = await res.json();

          if (res.ok && json.data?.token) {
            return {
              id: json.data.user.id.toString(),
              name: json.data.user.fullName,
              email: json.data.user.email,
              token: json.data.token,
              initials: json.data.user.initials,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // If logged in via Github, user token doesn't exist, we fallback to account.access_token
        // Note: The custom backend might not accept a Github token for its endpoints.
        token.token = (user as any).token || account?.access_token;
        // Fallback initials for Github user
        token.initials = (user as any).initials || user.name?.substring(0, 2).toUpperCase() || "GH";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.token = token.token as string;
        session.user.initials = token.initials as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
};
