import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";


test("renders after fetch", async () => {
  render(<App />);
  const heading = await screen.findByText(/UFO sightings/i);
  expect(heading).toBeInTheDocument();
});