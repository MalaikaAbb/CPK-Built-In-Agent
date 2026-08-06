import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    /**
     * The demo routes reproduce the documentation's code samples verbatim, and
     * nine errors across four of them do not typecheck against the shipped types
     * — implicit `any` props and `data-testid` in the Slots sample, `args` on
     * `useDefaultRenderTool`'s render props, `msg.content` rendered as a React
     * child, and the tool-message lookup in Programmatic Control.
     *
     * That is the point of this repo: showing what the docs currently publish,
     * not a corrected version of it. Each failure is called out on its own route
     * page and enumerated in the README, and `npm run typecheck` still prints
     * the full list — this flag only stops `next build` from refusing to produce
     * a bundle because of them.
     */
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
