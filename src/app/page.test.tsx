/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LandingPage from "./page";

describe("Home", () => {
  it("renders a heading", async () => {
    const jsx = await LandingPage();
    render(jsx);

    const heading = screen.getByText("Session Tracker");

    expect(heading).toBeInTheDocument();
  });
});
