import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import BookTable, { _handleBookClick } from "../BookTable";

describe("BookTable component", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.42);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Renders booking section with title and paragraph", () => {
    render(<BookTable />);
    expect(
      screen.getByRole("region", { name: /table booking section/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/book a table/i)).toBeInTheDocument();
    expect(
      screen.getByText(/please select a time slot to make sure/i)
    ).toBeInTheDocument();
  });

  test("Date input has correct attributes and enforces boundaries", () => {
    render(<BookTable />);
    const dateInput = screen.getByLabelText(/select booking date/i);

    const today = new Date().toISOString().slice(0, 10);
    const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .slice(0, 10);

    expect(dateInput).toHaveAttribute("type", "date");
    expect(dateInput).toHaveAttribute("min", today);
    expect(dateInput).toHaveAttribute("max", maxDate);
  });

  test("Time dropdown is enabled when date is selected", () => {
    render(<BookTable />);
    const timeSelect = screen.getByLabelText(/select booking time/i);
    expect(timeSelect).not.toBeDisabled();
  });

  test("Party size dropdown is disabled until a time is selected", () => {
    render(<BookTable />);
    const sizeSelect = screen.getByLabelText(/select party size/i);
    expect(sizeSelect).toBeDisabled();
  });

  test("Shows weekday vs weekend time slots correctly", () => {
    const { rerender } = render(<BookTable />);
    const dateInput = screen.getByLabelText(/select booking date/i);
    const timeSelect = screen.getByLabelText(/select booking time/i);
    
    //Weekday
    fireEvent.change(dateInput, { target: { value: "2025-09-22" } });
    expect(
      within(timeSelect).getByRole("option", { name: "21:00" })
    ).toBeInTheDocument();
    expect(
      within(timeSelect).queryByRole("option", { name: "23:00" })
    ).not.toBeInTheDocument();

    //Weekend
    rerender(<BookTable />);
    const newDateInput = screen.getByLabelText(/select booking date/i);
    const newTimeSelect = screen.getByLabelText(/select booking time/i);

    fireEvent.change(newDateInput, { target: { value: "2025-09-27" } });
    expect(
      within(newTimeSelect).getByRole("option", { name: "23:00" })
    ).toBeInTheDocument();
  });

  test("Book now button is disabled when renders everytime before selecting any feild", () => {
    render(<BookTable />);
    const bookButton = screen.getByRole("button", { name: /book a table/i });
    expect(bookButton).toBeDisabled();
  });

  test("Book now button is disabled until all fields are selected", () => {
    render(<BookTable />);

    const button = screen.getByRole("button", { name: /book a table/i });
    const dateInput = screen.getByLabelText(/select booking date/i);
    const timeInput = screen.getByLabelText(/select booking time/i);
    const partySizeInput = screen.getByLabelText(/select party size/i);

    // Initially disabled
    expect(button).toBeDisabled();

    // Fill date only
    fireEvent.change(dateInput, { target: { value: "2025-09-25" } });
    expect(button).toBeDisabled();

    // Fill date + time
    fireEvent.change(timeInput, { target: { value: "11:00" } });
    expect(button).toBeDisabled();

    // Fill all fields
    fireEvent.change(partySizeInput, { target: { value: "4" } });
    expect(button).toBeEnabled();

    // Clear party size
    fireEvent.change(partySizeInput, { target: { value: "" } });
    expect(button).toBeDisabled();
  });

  test("Enables book now button once date, time, and party size are chosen", () => {
    render(<BookTable />);

    const dateInput = screen.getByLabelText(/select booking date/i);
    const timeSelect = screen.getByLabelText(/select booking time/i);
    const sizeSelect = screen.getByLabelText(/select party size/i);
    const bookButton = screen.getByRole("button", { name: /book a table/i });

    fireEvent.change(dateInput, { target: { value: "2025-09-25" } });
    fireEvent.change(timeSelect, { target: { value: "11:00" } });
    fireEvent.change(sizeSelect, { target: { value: "4" } });

    expect(bookButton).not.toBeDisabled();
  });

  test("Renders restaurant image", () => {
    render(<BookTable />);
    expect(screen.getByAltText(/restaurant interior/i)).toBeInTheDocument();
  });

  test("handleBookClick early return when fields missing", () => {
    const setOpen = jest.fn();
    const setTableNo = jest.fn();

    _handleBookClick("", "", "", setOpen, setTableNo); // missing all
    expect(setOpen).not.toHaveBeenCalled();

    _handleBookClick("2025-09-27", "11:00", "4", setOpen, setTableNo); // all fields present
    expect(setOpen).toHaveBeenCalledWith(true);
    expect(setTableNo).toHaveBeenCalled();
  });

  test("handleBookClick executes false branch when fields missing", () => {
    render(<BookTable />);
    const bookButton = screen.getByRole("button", { name: /book a table/i });

    // Call the handler directly
    bookButton.onclick(); // runs the conditional without worrying about disabled

    // Modal should NOT appear
    expect(
      screen.queryByRole("dialog", { name: /reservation successful/i })
    ).not.toBeInTheDocument();
  });

  test("Shows success modal with reservation details on booking", async () => {
    render(<BookTable />);

    const dateInput = screen.getByLabelText(/select booking date/i);
    const timeSelect = screen.getByLabelText(/select booking time/i);
    const sizeSelect = screen.getByLabelText(/select party size/i);
    const bookButton = screen.getByRole("button", { name: /book a table/i });

    fireEvent.change(dateInput, { target: { value: "2025-09-27" } });
    fireEvent.change(timeSelect, { target: { value: "11:00" } });
    fireEvent.change(sizeSelect, { target: { value: "6" } });
    fireEvent.click(bookButton);

    const dialog = await screen.findByRole("dialog", {
      name: /reservation successful/i,
    });
    const modal = within(dialog);

    expect(
      await modal.findByText(/your table has been reserved/i)
    ).toBeInTheDocument();
    expect(await modal.findByText("2025-09-27")).toBeInTheDocument();
    expect(await modal.findByText("11:00")).toBeInTheDocument();
    expect(await modal.findByText("6")).toBeInTheDocument();
  });

  test("Closes modal when clicking footer close button", () => {
    render(<BookTable />);

    const dateInput = screen.getByLabelText(/select booking date/i);
    const timeSelect = screen.getByLabelText(/select booking time/i);
    const sizeSelect = screen.getByLabelText(/select party size/i);
    const bookButton = screen.getByRole("button", { name: /book a table/i });

    fireEvent.change(dateInput, { target: { value: "2025-09-28" } });
    fireEvent.change(timeSelect, { target: { value: "11:00" } });
    fireEvent.change(sizeSelect, { target: { value: "2" } });
    fireEvent.click(bookButton);

    const closeBtn = screen.getByRole("button", { name: /^close$/i });
    fireEvent.click(closeBtn);

    expect(
      screen.queryByRole("dialog", { name: /reservation successful/i })
    ).not.toBeInTheDocument();
  });

  test("Closes modal when clicking ✕ button in header", () => {
    render(<BookTable />);

    const dateInput = screen.getByLabelText(/select booking date/i);
    const timeSelect = screen.getByLabelText(/select booking time/i);
    const sizeSelect = screen.getByLabelText(/select party size/i);
    const bookButton = screen.getByRole("button", { name: /book a table/i });

    fireEvent.change(dateInput, { target: { value: "2025-09-29" } });
    fireEvent.change(timeSelect, { target: { value: "11:00" } });
    fireEvent.change(sizeSelect, { target: { value: "3" } });
    fireEvent.click(bookButton);

    const closeXBtn = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeXBtn);

    expect(
      screen.queryByRole("dialog", { name: /reservation successful/i })
    ).not.toBeInTheDocument();
  });
});
