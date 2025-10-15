import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("my-shop");

        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email: user.email });

        if (!existingUser) {
          await usersCollection.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          await usersCollection.updateOne(
            { email: user.email },
            { $set: { updatedAt: new Date() } }
          );
        }

        return true;
      } catch (error) {
        console.error("❌ Error in signIn callback:", error);
        return false;
      }
    },

    // 🔹 تعديل بيانات الـ session علشان تتضمن بيانات المستخدم من DB
    async session({ session }) {
      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME || "test");
      const usersCollection = db.collection("users");

      const dbUser = await usersCollection.findOne({ email: session.user?.email });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
        session.user.image = dbUser.image;
      }

      return session;
    },
  },
};
