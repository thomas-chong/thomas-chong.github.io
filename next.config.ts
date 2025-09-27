import type { NextConfig } from "next";
import { cp } from 'fs/promises';
import { join } from 'path';
import type { Compiler } from 'webpack';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '',
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new (class {
          apply(compiler: Compiler) {
            compiler.hooks.afterEmit.tapPromise(
              'CopyShikiWasm',
              async () => {
                try {
                  await cp(
                    join(
                      process.cwd(),
                      'node_modules/shiki/dist/shiki.mjs'
                    ),
                    join(process.cwd(), 'public/shiki/shiki.mjs'),
                    { recursive: true }
                  );
                  await cp(
                    join(
                      process.cwd(),
                      'node_modules/shiki/dist/shiki.wasm'
                    ),
                    join(process.cwd(), 'public/shiki/shiki.wasm'),
                    { recursive: true }
                  );
                } catch (err) {
                  console.error('Failed to copy shiki assets:', err);
                }
              }
            );
          }
        })()
      );
    }
    return config;
  },
};

export default nextConfig;