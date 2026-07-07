// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const ThrowingChild = () => {
  throw new Error("boom");
};

const HealthyChild = () => <p>All good</p>;

describe("ErrorBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the fallback when a child throws during render", () => {
    // React (and this boundary's componentDidCatch) log the caught error to
    // the console; that noise is expected here, so silence it.
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<p>Something broke</p>}>
        <ThrowingChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("renders a healthy child untouched", () => {
    render(
      <ErrorBoundary fallback={<p>Something broke</p>}>
        <HealthyChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("All good")).toBeInTheDocument();
    expect(screen.queryByText("Something broke")).not.toBeInTheDocument();
  });
});
