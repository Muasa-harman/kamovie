import { ReactNode } from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

function render(ui: ReactNode, options = {}) {
  return rtlRender(<Provider store={store}>{ui}</Provider>, options);
}

export * from "@testing-library/react";
export { render };
