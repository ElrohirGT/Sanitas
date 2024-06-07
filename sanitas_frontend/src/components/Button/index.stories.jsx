import { action } from "@storybook/addon-actions";
import React from "react";
import Button from ".";

export default {
  title: "Components/Button",
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: "Buscar paciente",
  onClick: action("clicked"),
};
