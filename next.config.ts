import type { NextConfig } from 'next';

const hasTurso = Boolean(process.env.TURSO_DATABASE_URL?.trim());

const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client'],
  outputFileTracingIncludes: hasTurso
    ? {
        '/api/**/*': ['./content/questions/custom-pack-example.json'],
      }
    : {
        '/api/**/*': ['./data/**/*', './content/questions/custom-pack-example.json'],
        '/**/*': ['./data/**/*', './content/questions/custom-pack-example.json'],
      },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
