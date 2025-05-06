import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Temporary in-memory user store (replace with database later)
const users = new Map<string, { email: string; password: string; name: string }>();

// Test User (in production, this would come from a database)
users.set("test@example.com", {
  email: "test@example.com",
  // In production, this would be properly hashed
  password: "password123",
  name: "Test User"
});

// Helper function to get user from store
async function getUserFromDb(email: string, password: string) {
  const user = users.get(email);
  if (!user) return null;
  
  // In production, this would use proper password comparison
  if (user.password !== password) return null;
  
  return {
    id: email,
    email: user.email,
    name: user.name,
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email", label: "Email" },
        password: { type: "password", label: "Password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await getUserFromDb(credentials.email, credentials.password);

        if (!user) {
          throw new Error("Invalid credentials");
        }
        
        return user;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
