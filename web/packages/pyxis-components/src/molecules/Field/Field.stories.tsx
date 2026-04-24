import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../atoms/Input';
import { Field } from './Field';
import { StoryFrame } from '../../storybook';

const meta: Meta<typeof Field> = {
  title: 'Molecules/Field',
  component: Field,
  tags: ['autodocs'],
  args: {
    label: 'Artist name',
    hint: 'Use the name that should appear on the poster.',
    children: <Input placeholder="Waxahatchee" />,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Artist name is required.',
    hint: undefined,
  },
};

export const States: Story = {
  render: () => (
    <StoryFrame id="molecules-field-states" component="field" level="molecule" layout="column" gap={16}>
      <Field label="Artist name" hint="Use the public billing name."><Input placeholder="Enter artist" /></Field>
      <Field label="Contact email" error="Enter a valid email."><Input placeholder="booking@example.com" /></Field>
    </StoryFrame>
  ),
  parameters: { controls: { disable: true } },
};
