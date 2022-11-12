import { resolve } from "node:path";

import type { EntryContext } from "@remix-run/node";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { initReactI18next } from "react-i18next";
import { RemixI18Next } from "remix-i18next";

import { config } from "./config"; // your i18n configuration file
import { i18nCookie } from "./cookie";

export const i18nextServer = new RemixI18Next({
  detection: {
    supportedLanguages: config.supportedLngs,
    fallbackLanguage: config.fallbackLng,
    cookie: i18nCookie,
  },
  i18next: {
    ...config,
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
  backend: Backend,
});

export async function createI18nextServerInstance(
  request: Request,
  remixContext: EntryContext
) {
  const instance = createInstance();
  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...config,
      lng: await i18nextServer.getLocale(request),
      ns: i18nextServer.getRouteNamespaces(remixContext),
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  return instance;
}