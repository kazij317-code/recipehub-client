"use client";
import { Switch } from "@heroui/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useThemeContext } from "@/providers/NextThemeProvider";
const ThemeToggle = () => {
  const { theme, setTheme } = useThemeContext();
  return (
    <Switch>
      {({ isSelected }) => (
        <>
          <Switch.Control
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`rounded-full  ${
              isSelected
                ? "bg-transparent shadow-[0_0_12px_rgba(255,122,0,0.45)]"
                : ""
            }`}
          >
            <Switch.Thumb
              className={` h-[50px] w-[50px] rounded-full bg-white shadow-sm ${
                isSelected ? "shadow-lg" : ""
              }`}
            >
              <Switch.Icon>
                {isSelected ? (
                  <SunIcon size={20} className=" text-[#ff7a00]" />
                ) : (
                  <MoonIcon size={20} className=" text-black" />
                )}
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Control>
        </>
      )}
    </Switch>
  );
};
export default ThemeToggle;
