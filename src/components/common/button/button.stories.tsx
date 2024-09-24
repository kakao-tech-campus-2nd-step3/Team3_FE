import { Meta, StoryFn } from "@storybook/react";
import ButtonComponent, { Props } from "@/components/common/button";

// Storybook의 메타데이터 설정
export default {
  title: "Components/Button",
  component: ButtonComponent,
  argTypes: {
    theme: {
      control: {
        type: "select",
        options: ["primary", "secondary"], //theme 옵션 정의
      },
    },
    size: {
      control: {
        type: "select",
        options: ["large", "medium", "small", "responsive"], //옵션 정의
      },
    },
    children: {
      control: "text",
    },
  },
} as Meta<typeof ButtonComponent>;

// Template 생성 (StoryFn으로 대체)
const Template: StoryFn<Props> = (args) => <ButtonComponent {...args} />;

//각 스토리 생성
export const PrimaryLarge = Template.bind({});
PrimaryLarge.args = {
  theme: "primary",
  size: "large",
  children: "Primary Large",
};

export const PrimaryMedium = Template.bind({});
PrimaryMedium.args = {
  theme: "primary",
  size: "medium",
  children: "Primary Medium",
};

export const PrimarySmall = Template.bind({});
PrimarySmall.args = {
  theme: "primary",
  size: "small",
  children: "Primary Small",
};

export const SecondaryLarge = Template.bind({});
SecondaryLarge.args = {
  theme: "secondary",
  size: "large",
  children: "Secondary Large",
};

export const SecondaryMedium = Template.bind({});
SecondaryMedium.args = {
  theme: "secondary",
  size: "medium",
  children: "Secondary Medium",
};

export const SecondarySmall = Template.bind({});
SecondarySmall.args = {
  theme: "secondary",
  size: "small",
  children: "Secondary Small",
};

export const ResponsiveButton = Template.bind({});
ResponsiveButton.args = {
  theme: "primary",
  size: "responsive",
  children: "Responsive Button",
};
