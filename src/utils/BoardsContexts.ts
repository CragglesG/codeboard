import { createContext } from "react";

export const CurrentLanguage = createContext<string>("JavaScript");

export const ChangeLanguage = createContext((newLanguage: string) => {});

export const ChangeFramework = createContext((framework: string) => {});
