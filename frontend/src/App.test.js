import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StockList from "./components/StockList";

jest.mock("axios");

describe("StockList Component", () => {
  test("renders stock dashboard", async () => {
    render(<StockList />);

    expect(screen.getByText("Stock Dashboard")).toBeInTheDocument();

    const mockData = {
      ticker: "AAPL",
      results: [{ v: 100, o: 150, c: 160, h: 170, l: 140, t: 1647326524000 }],
    };

    jest.spyOn(require("axios"), "get").mockResolvedValue({ data: mockData });

    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument();
    });
  });

  test("adds a new symbol to the list", async () => {
    render(<StockList />);

    const input = screen.getByLabelText("Select Symbol:");
    const addButton = screen.getByText("Add");
    fireEvent.change(input, { target: { value: "NFLX" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("NFLX")).toBeInTheDocument();
    });
  });
});
