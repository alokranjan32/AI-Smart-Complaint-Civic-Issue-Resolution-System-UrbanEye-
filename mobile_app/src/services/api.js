import axios from "axios";
import { NativeModules, Platform } from "react-native";

const STATIC_LAN_HOST = process.env.EXPO_PUBLIC_DEV_MACHINE_IP || "10.200.112.51";

function resolveDevHost() {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;

  if (!scriptURL) {
    return null;
  }

  const match = scriptURL.match(/https?:\/\/([^/:]+)(?::\d+)?/i);
  return match?.[1] || null;
}

function isTunnelHost(host) {
  return typeof host === "string" && host.endsWith(".exp.direct");
}

function normalizeApiUrl(url) {
  const trimmedUrl = url?.trim().replace(/\/$/, "");

  if (!trimmedUrl) {
    return null;
  }

  return trimmedUrl.endsWith("/api") ? trimmedUrl : `${trimmedUrl}/api`;
}

function resolveBaseUrl() {
  const configuredUrl = normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL);

  if (configuredUrl) {
    return configuredUrl;
  }

  const devHost = resolveDevHost();

  if (devHost && !isTunnelHost(devHost) && devHost !== "localhost" && devHost !== "127.0.0.1") {
    return `http://${devHost}:5000/api`;
  }

  if (Platform.OS === "android") {
    return `http://${STATIC_LAN_HOST}:5000/api`;
  }

  return `http://${STATIC_LAN_HOST}:5000/api`;
}

const API = axios.create({
  baseURL: resolveBaseUrl(),
});

export default API;
