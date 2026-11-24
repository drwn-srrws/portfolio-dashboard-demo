import { ClickAnalyticsPlugin } from "@microsoft/applicationinsights-clickanalytics-js";
import { DebugPlugin } from "@microsoft/applicationinsights-debugplugin-js";
import {
  ApplicationInsights,
  IConfig,
  IConfiguration,
  IPageViewTelemetry,
  ITelemetryPlugin,
  SeverityLevel,
} from "@microsoft/applicationinsights-web";
import { RoleKinds } from "@typings/Role";

export interface IAnalyticsClientOptions {
  connectionStringMap: Record<string, string>;
  hedEnv: string;
  hedClient: string;
  appVersion?: string;
  isDebuggingEnabled?: boolean;
}

export const clickPluginConfig = {
  AUTO_CAPTURE: true,
  dataTags: { useDefaultContentNameOrId: true },
};

export const debugPluginConfig = {
  trackers: [
    "trackEvent",
    "trackPageView",
    "trackPageViewPerformance",
    "trackException",
    "trackTrace",
    "trackMetric",
    "trackDependencyData",
    "throwInternal",
    "logInternalMessage",
    "triggerSend",
    "_sender",
  ],
};

export interface IAnalyticsClient {
  trackPageView: (name: string, uri: string) => void;
  trackEvent: (name: string, properties?: Record<string, unknown>) => void;
  trackMetric: (
    name: string,
    average: number,
    properties?: Record<string, unknown>
  ) => void;
  trackException: (exception: Error) => void;
  setAuthenticatedUser: (email: string, roles: RoleKinds[]) => void;
}

export class AnalyticsClient implements IAnalyticsClient {
  private isInitialized: boolean = false;
  private isDebuggingEnabled: boolean = false;

  private instances: Record<string, ApplicationInsights> = {};

  private userRoles?: RoleKinds[];
  private hedEnv?: string;
  private hedClient?: string;
  private appVersion?: string;

  private clickPlugin: ClickAnalyticsPlugin = new ClickAnalyticsPlugin();
  private debugPlugin: DebugPlugin = new DebugPlugin();

  public initialize(options: IAnalyticsClientOptions) {
    if (this.isInitialized) return;

    this.hedEnv = options.hedEnv;
    this.hedClient = options.hedClient;
    this.appVersion = options.appVersion;
    this.isDebuggingEnabled = options.isDebuggingEnabled ?? false;

    for (const [name, connectionString] of Object.entries(
      options.connectionStringMap
    )) {
      const appInsights = this.initializeAppInsights(connectionString);
      this.instances[name] = appInsights;
    }

    this.isInitialized = true;
  }

  private createAppInsights(connectionString: string) {
    const extensions: ITelemetryPlugin[] = [this.clickPlugin];

    const extensionConfig: Record<string, unknown> = {
      [this.clickPlugin.identifier]: clickPluginConfig,
      [this.debugPlugin.identifier]: debugPluginConfig,
    };

    if (this.isDebuggingEnabled) {
      extensions.push(this.debugPlugin as unknown as ITelemetryPlugin);
      extensionConfig[this.debugPlugin.identifier] = debugPluginConfig;
    }

    const appInsightsConfig: IConfiguration & IConfig = {
      connectionString,
      extensions,
      extensionConfig,
      enableAutoRouteTracking: true,
      autoTrackPageVisitTime: true,
      enableAjaxErrorStatusText: true,
    };

    const appInsights = new ApplicationInsights({
      config: appInsightsConfig,
    });

    return appInsights;
  }

  private setupTelemetry(appInsights: ApplicationInsights) {
    appInsights.addTelemetryInitializer((envelope) => {
      if (envelope.data) {
        envelope.data.userRoles = this.userRoles;
        envelope.data.hedEnv = this.hedEnv;
        envelope.data.hedClient = this.hedClient;
        if (this.appVersion) envelope.data.appVersion = this.appVersion;
      }

      if (envelope.tags) {
        envelope.tags["ai.user.roles"] = this.userRoles?.join(",");
        envelope.tags["ai.hed.env"] = this.hedEnv;
        envelope.tags["ai.hed.client"] = this.hedClient;
        if (this.appVersion) envelope.tags["ai.app.version"] = this.appVersion;
        delete envelope.tags["ai.location.country"];
      }
    });
  }

  private setupPageViewTracking(appInsights: ApplicationInsights) {
    appInsights.trackPageView({
      name: document.title,
      uri: window.location.pathname,
    } as IPageViewTelemetry);
  }

  private initializeAppInsights(connectionString: string) {
    const appInsights = this.createAppInsights(connectionString);

    this.setupTelemetry(appInsights);
    this.setupPageViewTracking(appInsights);

    appInsights.loadAppInsights();

    return appInsights;
  }

  public getAppInsights(name: string): ApplicationInsights {
    return this.instances[name];
  }

  public trackPageView(name: string, uri: string) {
    for (const [, appInsights] of Object.entries(this.instances)) {
      appInsights.trackPageView({ name, uri });
    }
  }

  public trackEvent(name: string, properties?: Record<string, unknown>) {
    for (const [, appInsights] of Object.entries(this.instances)) {
      appInsights.trackEvent({ name }, properties);
    }
  }

  public trackMetric(
    name: string,
    average: number,
    properties?: Record<string, unknown>
  ) {
    for (const [, appInsights] of Object.entries(this.instances)) {
      appInsights.trackMetric({ name, average }, properties);
    }
  }

  public trackException(exception: Error) {
    for (const [, appInsights] of Object.entries(this.instances)) {
      appInsights.trackException({
        exception,
        severityLevel: SeverityLevel.Error,
      });
    }
  }

  public setAuthenticatedUser(email: string, roles: RoleKinds[]): void {
    this.userRoles = roles;

    for (const [, appInsights] of Object.entries(this.instances)) {
      appInsights.setAuthenticatedUserContext(email, undefined, true);
    }
  }
}

export class MockAnalyticsClient implements IAnalyticsClient {
  public trackPageView() {}
  public trackEvent() {}
  public trackMetric() {}
  public trackException() {}
  public setAuthenticatedUser() {}
}

export const analyticsClient = new AnalyticsClient();
export const mockAnalyticsClient = new MockAnalyticsClient();
