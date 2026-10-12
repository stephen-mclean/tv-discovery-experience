import { Button, type ButtonProps } from "./Button";

export default {
  title: "Button",
};

// Args are editable from the Ladle controls panel.
export const Primary = (args: ButtonProps) => <Button {...args} />;
Primary.args = {
  children: "Primary",
  variant: "primary",
  disabled: false,
};
Primary.argTypes = {
  variant: {
    options: ["primary", "secondary"],
    control: { type: "radio" },
  },
};

export const Secondary = () => <Button variant="secondary">Secondary</Button>;
