# portfolio-dashboard-demo

An interactive portfolio analytics demo with three dashboards: **Position Exposure**, **Position Differences**, and **Performance Summary**. The dashboards include Dockview layouts, AG Grid tables, charts, sidebar, filters, and date range controls.

## Run on Windows

You need Node.js 22 or later. Run these commands in PowerShell from the repository root.

```powershell
npm.cmd --prefix core/cloud-frontend ci
npm.cmd --prefix core/cloud-frontend run build
npm.cmd --prefix backend ci
npm.cmd --prefix backend run build
npm.cmd --prefix backend start
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). All three dashboards are available without signing in.

For hot reload, run `npm.cmd --prefix core/cloud-frontend run dev` in a second terminal and open [http://127.0.0.1:5173](http://127.0.0.1:5173). Vite proxies `/api` to port 8000. Set `DEMO_API_TARGET` to use a different backend address. On macOS and Linux, use `npm` in place of `npm.cmd`.

AG Grid Enterprise runs in trial mode and may display a watermark.

## Project structure and data

- `core/cloud-frontend` contains the React frontend. The sidebar links to the three demo dashboards. The other frontend modules and generated API clients provide a starting point for extensions.
- `backend/src/portfolio` contains the NestJS controller, request validation, and calculations for exposure, P&L, and trade statistics.
- `backend/src/portfolio/data.ts` defines two fictional funds and a simulated benchmark. The client portfolio endpoint uses Frankfurter exchange rates and falls back to a local snapshot.
- `backend/src/main.ts` starts the application. [Swagger UI](http://127.0.0.1:8000/docs) documents the available API endpoints.

## Live demo

[Open the dashboards](https://drwn-srrws.github.io/portfolio-dashboard-demo/).

GitHub Pages serves the frontend. The site runs the same portfolio calculations in your browser using simulated holdings. To build this version locally after installing both sets of dependencies, run:

```sh
npm run build --prefix core/cloud-frontend -- --mode pages
node backend/browser/build.mjs
npm run preview --prefix core/cloud-frontend
```
