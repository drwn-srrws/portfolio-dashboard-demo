import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import qs from "qs";

export const AXIOS_INSTANCE: AxiosInstance = Axios.create({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

function requestBodyReplacer(_: string, value: unknown) {
  if (value === undefined) {
    return null;
  }
  return value;
}

AXIOS_INSTANCE.defaults.baseURL = import.meta.env.VITE_PUBLIC_API_URL;

AXIOS_INSTANCE.defaults.transformRequest = [
  (data, headers) => {
    if (data && headers["Content-Type"] === "application/json") {
      return JSON.stringify(data, requestBodyReplacer);
    }
    return data;
  },
];

if (import.meta.env.MODE === "pages") {
  AXIOS_INSTANCE.defaults.adapter = async (config) => {
    const moduleUrl = new URL(import.meta.env.BASE_URL + "demo-api.js", document.baseURI).href;
    const api = await import(/* @vite-ignore */ moduleUrl);
    const result = await api.request(
      (config.method ?? "GET").toUpperCase(),
      AXIOS_INSTANCE.getUri(config),
      typeof config.data === "string" ? JSON.parse(config.data) : config.data,
    );
    const response = { ...result, statusText: "", headers: {}, config };
    if (config.validateStatus && !config.validateStatus(response.status)) {
      throw new AxiosError(
        `Demo request failed with status code ${response.status}`,
        AxiosError.ERR_BAD_REQUEST,
        config,
        undefined,
        response,
      );
    }
    return response;
  };
}

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
