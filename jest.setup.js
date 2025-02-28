import "@testing-library/jest-dom";

jest.mock("framer-motion", () => ({
    motion: {
      div: "div",
    },
  }));
  