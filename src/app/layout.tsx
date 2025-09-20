"use client";

import "./globals.css";
import { ApolloProvider } from "@apollo/client/react";
import client from "./graphql/apollo-client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
