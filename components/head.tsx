import React from "react";
import NextHead from "next/head";
import generateNonce from "@/utils/generate-nonce";

const nonce = generateNonce();
const content = "default-src 'none'; script-src 'nonce-" + nonce + "'";
const Head = () => {
  return (
    <NextHead>
      <meta httpEquiv="Content-Security-Policy" content={content} />
    </NextHead>
  );
};

export default Head;
