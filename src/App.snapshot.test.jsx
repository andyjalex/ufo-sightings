import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import App from "./App";
describe("App Component", () => {
  // Test to ensure the rendered App component matches the saved snapshot:
  test("matches the snapshot", () => {
    const { asFragment } = render(<App />); // Render the App component.
    expect(asFragment()).toMatchSnapshot(); // Compare with stored snapshot.
  });
});
