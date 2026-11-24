const prefixes = new WeakMap();
const routes = new WeakMap();
const parameters = new WeakMap();

export class HttpException extends Error {
  constructor(response, status) {
    super(typeof response === "string" ? response : "Request failed");
    this.response = response;
    this.status = status;
  }
}

export class NotFoundException extends HttpException {
  constructor(message) {
    super({ detail: message }, 404);
  }
}

export const Injectable = () => () => {};
export const HttpCode = () => () => {};
export const Controller = (prefix) => (type) => { prefixes.set(type, prefix); };

function route(method, path) {
  return (target, handler) => {
    const entries = routes.get(target) ?? [];
    entries.push({ method, path, handler });
    routes.set(target, entries);
  };
}

export const Get = (path) => route("GET", path);
export const Post = (path) => route("POST", path);

function parameter(read) {
  return (target, handler, index) => {
    const handlers = parameters.get(target) ?? new Map();
    const readers = handlers.get(handler) ?? [];
    readers[index] = read;
    handlers.set(handler, readers);
    parameters.set(target, handlers);
  };
}

export const Body = (pipe) => parameter(({ body }) => pipe.transform(body));
export const Param = (name) => parameter(({ params }) => params[name]);
export const Query = (name) => parameter(({ url }) => url.searchParams.get(name));

export function register(controller) {
  const prototype = Object.getPrototypeOf(controller);
  const prefix = prefixes.get(controller.constructor);
  return routes.get(prototype).map(({ method, path, handler }) => ({
    method,
    path: `/${prefix}/${path}`.split("/"),
    run: (input) => {
      const readers = parameters.get(prototype)?.get(handler) ?? [];
      return controller[handler](...readers.map((read) => read(input)));
    },
  }));
}
