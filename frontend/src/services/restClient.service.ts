import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import authHeader from "./auth.header";

const cachedRequestKey: string = "cachedRequests";
const defaultTimeout = 10 * 1000; // 10 seconds

class RestClient {
  client: AxiosInstance;
  cache: AxiosRequestConfig[];
  timerId: any;
  static instance: RestClient;

  static getInstance(): RestClient {
    if (RestClient.instance) {
      return RestClient.instance;
    }
    RestClient.instance = new RestClient();
    return RestClient.instance;
  }

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL,
      headers: authHeader(),
    });
    this.cache = JSON.parse(localStorage.getItem(cachedRequestKey) || "[]");
    this.timerId = undefined;
    if (this.cache.length > 0) {
      this.retryCachedCalls();
    }
  }

  retryCachedCalls() {
    this.timerId = setInterval(() => {
      this.postCachedRequest(this.cache[0]);
    }, defaultTimeout);
  }

  get(path: string, config?: AxiosRequestConfig) {
    return this.client.get(path, config);
  }

  patch(path: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.patch(path, data, config);
  }

  delete(path: string, config?: AxiosRequestConfig) {
    return this.client.delete(path, config);
  }

  post(path: string, data?: any, config?: AxiosRequestConfig) {
    if (path.includes("event")) {
      this.client
        .post(path, data, config)
        .then((response) => {
          return Promise.resolve(response);
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            if (config) {
              config.url = path;
              config.method = "post";
              config.data = data;
            } else {
              config = {
                url: path,
                method: "post",
                data: data,
              };
            }
            this.cache.push(config);
            if (this.timerId === undefined) {
              this.retryCachedCalls(); // if undefined, we don't have a current interval so we start one
            }
            localStorage.setItem(cachedRequestKey, JSON.stringify(this.cache));
            return Promise.resolve({ isCached: true });
          }
          return Promise.reject(err);
        });
    }
    return this.client.post(path, data, config);
  }

  private postCachedRequest(config: AxiosRequestConfig) {
    console.log(config);
    this.client
      .request(config)
      .then(() => {
        const ind = this.cache.findIndex((cachedRequestConfig) => {
          return JSON.stringify(cachedRequestConfig) === JSON.stringify(config);
        });
        if (ind > -1) {
          this.cache.splice(ind, 1);
        }
        localStorage.setItem(cachedRequestKey, JSON.stringify(this.cache));
        if (this.cache.length === 0) {
          // no more cached requests so we reset the state and stop the interval
          clearTimeout(this.timerId);
          this.timerId = undefined;
          localStorage.removeItem(cachedRequestKey);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const ind = this.cache.findIndex((cachedRequestConfig) => {
            return (
              JSON.stringify(cachedRequestConfig) === JSON.stringify(config)
            );
          });
          if (ind > -1) {
            this.cache[ind].headers = authHeader(); // if the call is unauthorized the header token may have expired, so we refresh it
            this.client.defaults.headers = authHeader(); // refresh the default header as well
          }
        }
      });
  }

  put(path: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put(path, data, config);
  }
}

export default RestClient;
