
import { StoryFn, Meta } from '@storybook/react';
import { MicrophoneButton, MicrophoneButtonProps } from './index';

export default {
  title: 'Components/MicrophoneButton',
  component: MicrophoneButton,
} as Meta<typeof MicrophoneButton>;

const Template: StoryFn<MicrophoneButtonProps> = (args) => <MicrophoneButton {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithCustomOnClick = Template.bind({});
WithCustomOnClick.args = {
  onClick: () => console.log('Microphone button clicked'),
};