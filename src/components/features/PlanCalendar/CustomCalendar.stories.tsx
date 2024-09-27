/** @jsxImportSource @emotion/react */
import { Meta, StoryObj } from '@storybook/react';
import CustomCalendar from './CustomCalendar'; 

const meta: Meta<typeof CustomCalendar> = {
  title: 'Components/CustomCalendar', 
  component: CustomCalendar,
};

export default meta;

// Story 타입 정의
type Story = StoryObj<typeof CustomCalendar>;

// 기본 Story
export const Default: Story = {};

// 다른 상태를 테스트할 스토리 추가 (선택 사항)
export const WithEvents: Story = {
  args: {
    // 추가적인 props 설정이 필요하다면 여기에 추가
  },
};
