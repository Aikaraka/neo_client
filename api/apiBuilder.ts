import { callServerAction } from "@/api/server";

type HTTPParams = Array<string> | string;
type HttpMethod = "POST" | "GET" | "PUT" | "DELETE";
type RequestBody = Record<string, unknown>;
type RequestFunction = () => Promise<Response>;
type ResponseMiddleware<T> = (
  data: T,
  request: RequestFunction
) => T | Promise<T>;
type RequestMiddleware<T> = (config: T) => T;

class API {
  baseURL: string;
  headers?: HeadersInit;
  params?: HTTPParams;
  timeOut?: number;
  endPoint?: string;
  withCredentials?: boolean;
  serveraction?: boolean;
  use: {
    request: RequestMiddleware<RequestInit>;
    response: ResponseMiddleware<Response>;
  };

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.use = {
      request: (config) => config,
      response: async (response, requestConfig) => response,
    };
  }

  getParams() {
    if (this.params) {
      return Array.isArray(this.params)
        ? this.params.join("/")
        : `/${this.params}`;
    }
    return "";
  }

  async request(method: HttpMethod, data?: RequestBody) {
    const params = this.getParams();
    const fetchFunction = async () => {
      const url = this.baseURL + this.endPoint + params;
      let options: RequestInit = {
        method,
        credentials: this.withCredentials ? "include" : "omit",
        headers: this.headers as HeadersInit,
        ...(data && { body: JSON.stringify(data) }),
      };

      options = this.use.request(options);

      if (this.serveraction) {
        return callServerAction(url, options);
      }
      return fetch(url, options);
    };

    const response = await fetchFunction();
    return this.use.response(response, fetchFunction);
  }

  get(data?: RequestBody) {
    return this.request("GET", data);
  }
  post(data: RequestBody) {
    return this.request("POST", data);
  }
  delete() {
    return this.request("DELETE");
  }
  put(data: RequestBody) {
    return this.request("PUT", data);
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

  params(params: HTTPParams): APIBuilder {
    this._instance.params = params;
    return this;
  }

  endPoint(endPoint: string): APIBuilder {
    this._instance.endPoint = endPoint;
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
