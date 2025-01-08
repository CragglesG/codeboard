// src/App.jsx
import "./App.css";
import Header from "./components/Header.jsx";
import HeroSection from "./components/HeroSection.jsx";
import FeaturesSection from "./components/FeaturesSection.jsx";
import Footer from "./components/Footer.jsx";
import { Routes, Route } from "react-router";
import Scribbles from "./components/Scribbles";
import Dashboard from "./components/Dashboard.jsx";
import * as Sentry from "@sentry/react";
import React from "react";

Sentry.init({
  dsn: "https://3b191aca4fcecef5a9eeb55b93032b8a@o4508506807599104.ingest.de.sentry.io/4508574679433296",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const Home = () => (
  <div className="App">
    <Header />
    <HeroSection />
    <FeaturesSection />
    <Footer />
  </div>
);

const DashboardElement = () => <Dashboard />;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scribbles" element={<Scribbles />} />
      <Route path="/dashboard" element={<DashboardElement />} />
    </Routes>
  );
}

export default App;
