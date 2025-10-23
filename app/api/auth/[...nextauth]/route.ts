import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// fancy a tea?
// oi bruv innit
// perhaps (5 > 2) {
//   console.fancy("hello");
// } otherwise {
//   console.fancy("innit brotha");
// }

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    // @ts-expect-error No tip Script Dicks :cry:
    async session({ session, token,  user }) {
      console.log(user);
      session.user.id = user.id;
      session.user.username = user.username;
      return session
    },
  },
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }