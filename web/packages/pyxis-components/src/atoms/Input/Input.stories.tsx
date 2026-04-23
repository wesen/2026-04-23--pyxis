import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A text input field with optional label, hint, error, and icon support.',
      },
    },
  },
  args: {
    placeholder: 'Enter text…',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'number', 'date', 'password', 'search'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Artist name',
    placeholder: 'Enter artist name',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    hint: "We'll never share your email.",
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'not-an-email',
    error: 'Please enter a valid email address.',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Search',
    icon: 'search',
    placeholder: 'Search shows…',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    defaultValue: 'Cannot edit',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input label="Text input" placeholder="Text" />
      <Input label="Email input" type="email" placeholder="you@example.com" />
      <Input label="Number input" type="number" placeholder="42" />
      <Input label="With search icon" icon="search" placeholder="Search…" />
      <Input label="With error" error="This field is required" defaultValue="wrong" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Playground: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder…',
  },
};
