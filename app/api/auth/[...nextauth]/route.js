import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session({ session }) {
    try {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();

      return session;
    } catch (error) {
      console.log(error);
    }
  },
  async signIn({ profile }) {
    try {
      await connectToDB();

      //user exist

      const userExist = await User.findOne({ email: profile.email });

      //if user not exist 
      
      if(!userExist){
        await User.create({
          username: profile.name.replace(" ","").toLowerCase(),
          email: profile.email,
          image: profile.picture,
        })
      }
    } catch (error) {
      console.log(error);
    }
  },
});

export {handler as GET , handler as POST};