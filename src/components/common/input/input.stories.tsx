import { Meta, StoryFn } from "@storybook/react";
import Input, { Props } from "@/components/common/Input";

// 스토리북의 메타데이터 설정
export default {
  title: "Components/VoiceInput", // 스토리북에서 컴포넌트를 보여줄 섹션 이름
  component: Input,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["large", "medium", "small", "responsive"], // size 옵션 정의
      },
    },
    placeholder: {
      control: "text", // placeholder는 사용자가 직접 입력할 수 있도록 설정
    },
  },
} as Meta<typeof Input>;

// Template 생성 (StoryFn으로 컴포넌트를 렌더링)
const Template: StoryFn<Props> = (args) => <Input {...args} />;

// 각 스토리 생성
export const Large = Template.bind({});
Large.args = {
  size: "large",
  placeholder: "Large Input",
};

export const Medium = Template.bind({});
Medium.args = {
  size: "medium",
  placeholder: "Medium Input",
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  placeholder: "Small Input",
};

export const Responsive = Template.bind({});
Responsive.args = {
  size: "responsive",
  placeholder: "Responsive Input",
};
