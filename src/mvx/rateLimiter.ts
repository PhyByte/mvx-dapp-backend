import Bottleneck from 'bottleneck';

// Retrieve the API rate limit from the environment variable (default to 5 if not provided)
const apiRateLimit = parseInt(process.env.API_RATE_LIMIT || '1', 10);

// Configure the limiter
const limiter = new Bottleneck({
  reservoir: apiRateLimit, // Maximum amount of requests allowed initially
  reservoirRefreshAmount: apiRateLimit, // Refill the reservoir
  reservoirRefreshInterval: 1000, // Every 1 second (1000ms)
  minTime: 1000 / apiRateLimit, // Time interval between requests
  // maxConcurrent: 1, // Ensure only one request is processed at a time
});

export const rateLimitedApiCall = limiter.wrap(
  async (apiCall: () => Promise<any>) => {
    return apiCall();
  },
);
