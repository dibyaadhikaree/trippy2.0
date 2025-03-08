import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { getUserFromEmail, createUser } from "@/app/_services/data-services";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, req }) {
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        // Assuming 'preferences' is a field in your User model
        token.preferences = user.preferences || [];
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      try {
        const currentUser = await getUserFromEmail(user.email);

        if (currentUser != null) {
          return true;
        }
        // //old guest do nothing
        // //new guest then update database
        const newUser = await createUser({
          name: user.name,
          email: user.email,
        });

        user.needsPreferences = true;

        return true;
      } catch (err) {
        console.log(err, "error in sign in ");
        return false;
      }
    },
    async session({ session, user }) {
      //In each session the ID updated to the database for an user will not be accessible , so the id is fetched and session is mutated

      const currentUser = await getUserFromEmail(session.user.email);

      if (currentUser) {
        session.user.userId = currentUser._id;
        session.user.preferences = currentUser.preferences;
        session.user.likedPlaces = currentUser.likedPlaces;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST, authConfig };

// export const {
//   handlers: { GET, POST },
//   signIn,
//   signOut,
//   auth,
// } = NextAuth(authConfig);
