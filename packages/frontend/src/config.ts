const config = {
  // Backend config
  s3: {
    REGION: import.meta.env.VITE_REGION,
    BUCKET: import.meta.env.VITE_BUCKET,
  },
  apiGateway: {
    REGION: import.meta.env.VITE_REGION,
    URL: import.meta.env.VITE_API_URL,
  },
  cognito: {
    REGION: import.meta.env.VITE_REGION,
    USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
    APP_CLIENT_ID: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: import.meta.env.VITE_IDENTITY_POOL_ID,
  },
  // Frontend config
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY:
    "pk_test_51IIxMfERo4xBMkUCneKiF9fHKtxPmUdxJQBOUXzbWXeAVFqm2PlJva33BC9XJ7HjIARzIUzGbHJIQiSvyI7SGSw400w6MwAw6G",
};
export default config;
