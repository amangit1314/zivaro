/** @type {import('next').NextConfig} */
const nextConfig = {
  // future: {
  //   // by default, if you customize webpack config, they switch back to version 4.
  //   // Looks like backward compatibility approach.
  //   webpack5: true,   
  // },

  // webpack(config) {
  //   config.resolve.fallback = {

  //     // if you miss it, all the other options in fallback, specified
  //     // by next.js will be dropped.
  //     ...config.resolve.fallback,  

  //     fs: false, // the solution
  //   };
    
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn3.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
