import { callServerAction } from "@/api/server";

type HttpMethod = "POST" | "GET" | "PUT" | "DELETE";
type RequestBody = Record<string, any>;
type RequestFunction = () => Promise<Response>;
type ResponseMiddleware<T> = (
  data: T,
  request: RequestFunction
) => T | Promise<T>;
type RequestMiddleware<T> = (config: T) => Promise<T>;

class API {
  baseURL: string;
  headers?: HeadersInit;
  timeOut?: number;
  withCredentials?: boolean;
  serveraction?: boolean;
  use: {
    request: RequestMiddleware<RequestInit>;
    response: ResponseMiddleware<Response>;
  };

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.use = {
      request: async (config) => config,
      response: async (response) => response,
    };
  }

  async request(
    method: HttpMethod,
    endpoint?: string,
    data?: RequestBody,
    additionalOptions?: RequestInit
  ) {
    const fetchFunction = async () => {
      const url = this.baseURL + endpoint;
      let options: RequestInit = {
        ...additionalOptions,
        method,
        credentials: this.withCredentials ? "include" : "omit",
        headers: Object.assign({}, this.headers, additionalOptions?.headers),
        ...(data && { body: JSON.stringify(data) }),
      };

      options = await this.use.request(options);

      if (this.serveraction) {
        return callServerAction(url, options);
      }
      return fetch(url, options);
    };

    const response = await fetchFunction();
    if (!response.ok) {
      const erroMsg = await response.text();
      throw new Error(erroMsg);
    }

    const responseAfterMiddleWare = await this.use.response(
      response,
      fetchFunction
    );

    if (!responseAfterMiddleWare.ok) {
      const erroMsg = await responseAfterMiddleWare.text();
      throw new Error(erroMsg);
    }

    return responseAfterMiddleWare;
  }

  get(endPoint?: string, options?: RequestInit) {
    return this.request("GET", endPoint, undefined, options);
  }
  post(endPoint?: string, data?: RequestBody, options?: RequestInit) {
    return this.request("POST", endPoint, data, options);
  }
  delete(endPoint?: string, data?: RequestBody, options?: RequestInit) {
    return this.request("DELETE", endPoint, data, options);
  }
  put(endPoint?: string, data?: RequestBody, options?: RequestInit) {
    return this.request("PUT", endPoint, data, options);
  }
}

class APIBuilder {
  private _instance: API;

  constructor(baseURL: string) {
    this._instance = new API(baseURL);
  }

  headers(headerOptions: HeadersInit): APIBuilder {
    this._instance.headers = headerOptions;
    return this;
  }

  timeOut(time: number): APIBuilder {
    this._instance.timeOut = time;
    return this;
  }

  withCredentials(withCredentials: boolean): APIBuilder {
    this._instance.withCredentials = withCredentials;
    return this;
  }

  build(): API {
    return this._instance;
  }

  serveraction(): APIBuilder {
    this._instance.serveraction = true;
    return this;
  }
}

export { APIBuilder };
export type { HttpMethod, RequestFunction };
