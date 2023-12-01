/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/pages/member/login",
                permanent: true,
            },
        ];
    },
}

module.exports = nextConfig
