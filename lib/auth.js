import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "./mongodb";
import User from "../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          await connectToDatabase();
          let existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving user to DB:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      // Add user ID to the session object
      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.id = dbUser._id.toString();
        }
      } catch (error) {
        console.error("Error fetching user for session:", error);
      }
      return session;
    }
  },
};
