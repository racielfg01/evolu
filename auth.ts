// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import {prisma} from '@/lib/prisma'; 
// import bcrypt from 'bcryptjs';

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' }
//       },
//       authorize: async (credentials) => {
//         // Use findFirst instead of findUnique to query by email
//         const user = await prisma.user.findFirst({
//           where: { email: credentials?.email as string }
//         });

//         if (!user) return null;

//         const isValid = await bcrypt.compare(
//           credentials?.password as string,
//           user.password // Assuming your User model has a 'password' field
//         );

//         if (!isValid) return null;

//         // Return user object if authentication is successful
//         return {
//           id: user.id,
//           name: user.name, // Include other necessary user properties
//           email: user.email,
//           image: user.image,
//           // ... other user properties you need
//         };
//       }
//     })
//   ],
//   secret: process.env.AUTH_SECRET,
//   // trustHost: true,
//   session: { strategy: "jwt" },
//   pages: {
//     signIn: '/login', // Specify your sign-in page
//     // error: '/auth/error', // Specify your error page
//   },
//   logger: {
//     error(code, metadata) {
//       console.error(code, metadata);
//     },
//     warn(code) {
//       console.warn(code);
//     },
//     debug(code, metadata) {
//       console.debug(code, metadata);
//     },
//   },
// });

// import NextAuth from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "@/lib/prisma"
 
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [],
//   secret: process.env.AUTH_SECRET
// })

// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";
// // import Google from "next-auth/providers/google";
// // import GitHub from "next-auth/providers/github";
// import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   providers: [
//     // Google,
//     // GitHub,
//     Credentials({
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         const user = await prisma.user.findUnique({
//           where: { email: credentials?.email as string },
//         });

//         if (user && await bcrypt.compare(credentials?.password as string, user.password!)) {
//           return { id: user.id, email: user.email, role: user.role };
//         }
//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token.sub) {
//         const user = await prisma.user.findUnique({
//           where: { id: token.sub },
//           // select: { role: true, emailVerified: true }
//         });
        
//         // session.user.role = user?.role;
//         // session.user.emailVerified = user?.emailVerified;
//         session.user.id = token.sub;
//       }
//       return session;
//     },
//     async jwt({ token }) {
//       return token;
//     }
//   },
//   pages: {
//     signIn: "/login",
//     verifyRequest: "/verify-email",
//     // error: "/auth/error"
//   }
// });


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// // import GitHub from "next-auth/providers/github";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";


// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // GitHub,
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         name: { label: "Name", type: "name" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         console.log("User ");
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials");
//         }
        
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email ?? "" },
//         });
        
//         if (!user) {
          
//           return await prisma.user.create({
//             data: {
//               name: credentials.name ?? credentials.email,
//               email: credentials.email,
//               password: await bcrypt.hash(credentials.password, 10),
//               sex: "Male"
//             },
//           });
//         }
  
//         const isCorrectPassword = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );
  
//         if (!isCorrectPassword) {
//           throw new Error("Invalid credentials");
//         }
  
//         return user;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 días
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       token.role = user?.role;
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.sub ?? "";
//       session.user.role = token.role ?? "";
//       return session;
//     }
//   },
//   secret: process.env.AUTH_SECRET,
  

// });


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";

// // const authOptions = {
// //   adapter: PrismaAdapter(prisma),
// //   providers: [
// //     CredentialsProvider({
// //       name: "credentials",
// //       credentials: {
// //         email: { label: "Email", type: "email" },
// //         name: { label: "Name", type: "name" },
// //         password: { label: "Password", type: "password" },
// //       },
// //       async authorize(credentials) {
// //         if (!credentials?.email || !credentials?.password) {
// //           throw new Error("Invalid credentials");
// //         }
        
// //         const user = await prisma.user.findUnique({
// //           where: { email: credentials.email ?? "" },
// //         });

// //         console.log("auth user",user)
        
// //         if (!user) {
// //           return await prisma.user.create({
// //             data: {
// //               name: credentials.name ?? credentials.email,
// //               email: credentials.email,
// //               password: await bcrypt.hash(credentials.password, 10),
// //               sex: "Male"
// //             },
// //           });
// //         }
  
// //         const isCorrectPassword = await bcrypt.compare(
// //           credentials.password,
// //           user.password
// //         );
  
// //         if (!isCorrectPassword) {
// //           throw new Error("Invalid credentials");
// //         }
  
// //         return user;
// //       },
// //     }),
// //   ],
// //   pages: {
// //     signIn: "/login",
// //   },
// //   session: {
// //     strategy: "jwt",
// //     maxAge: 30 * 24 * 60 * 60, // 30 días
// //   },
// //   callbacks: {

// //     async jwt({ token, user }) {
// //       console.log('token',token)
// //       console.log('user',user)
// //       token.role = user?.role;
// //       return token;
// //     },
// //     async session({ session, token }) {
// //       console.log('token',token)
// //       console.log('session',session)
// //       session.user.id = token.sub ?? "";
// //       session.user.role = token.role ?? "";
// //       return session;
// //     }
// //   },
// //   secret: process.env.AUTH_SECRET,
// //   // trustHost: true
// // };

// export const config = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       authorize: async (credentials): Promise<any> => {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         try {
//           const user = await prisma.user.findUnique({
//             where: {
//               email: credentials.email as string
//             }
//           })

//           if (!user || !user.hashedPassword) {
//             return null
//           }

//           const isPasswordValid = await bcrypt.compare(
//             credentials.password as string,
//             user.hashedPassword
//           )

//           if (!isPasswordValid) {
//             return null
//           }

//           return {
//             id: user.id as string,
//             email: user.email as string,
//             name: user.name as string,
//           }
//         } catch (error) {
//           console.error('Error during authentication:', error)
//           return null 
//         }
//       }
//     })
//   ],
//   secret: process.env.AUTH_SECRET,
//   pages: {
//     signIn: '/login',
//   },
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.email = user.email
//         token.name = user.name
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string
//         session.user.email = token.email as string
//         session.user.name = token.name as string
//       }
//       return session
//     },
//   },
// } satisfies NextAuthConfig;

// export const {
//   handlers,
//   auth,
//   signIn,
//   signOut,
// } = NextAuth(config);

// export const GET = NextAuth(config);
// export const POST = NextAuth(config);



// ====Funciona
// import CredentialsProvider from "next-auth/providers/credentials";
// import  { type NextAuthOptions } from "next-auth";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         name: { label: "Name", type: "name" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         // console.log('user*******',user)

//         if (!user) {
//           return await prisma.user.create({
//             data: {
//               name: credentials.name ?? credentials.email,
//               email: credentials.email,
//               password: await bcrypt.hash(credentials.password, 10),
//             },
//           });
//         }

//         // const isCorrectPassword = await bcrypt.compare(
//         //   credentials.password,
//         //   user.password
//         // );

//         // if (!isCorrectPassword) {
//         //   throw new Error("Invalid credentials");
//         // }

//         return user;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       return { ...token, id: token.id ?? user?.id };
//     },
//     async session({ session, token }) {
//       return { ...session, user: { ...session.user, id: token.id } };
//     },
//   },
// } satisfies NextAuthOptions;

