import {NextConfig} from 'next';
import createMDX from '@next/mdx'

const withMDX = createMDX({
    extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
    eslint: {
        dirs: ['app', 'components', 'lib']
    },
    pageExtensions: ['mdx', 'ts', 'tsx'],
};

export default withMDX(nextConfig);