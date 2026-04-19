import { render } from "@testing-library/react";
import { SettingsProvider } from "../context/SettingsContext";

export function renderWithProviders(ui: React.ReactNode) {
  return render(
    <SettingsProvider>
      {ui}
    </SettingsProvider>
  );
}
