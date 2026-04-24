import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../Icon';
import { Button } from './Button';
import type { ButtonVariant, ButtonSize } from './Button';
import { buttonVariants } from '../../tokens';
import { StoryFrame } from '../../storybook';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A clickable element for triggering actions.

**Variants:** \`primary\` (crimson CTA) · \`dark\` · \`outline\` · \`ghost\` · \`danger\` · \`success\` · \`discord\`
**Sizes:** \`sm\` (32px) · \`md\` (40px) · \`lg\` (48px)

\`\`\`tsx
<Button variant="primary" iconRight="chevron-right">Get tickets</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button isLoading>Submitting…</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.keys(buttonVariants) as ButtonVariant[],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] as ButtonSize[],
    },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Button',
    isLoading: false,
    fullWidth: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ────────────────────────────────────────────

/** The primary button — use for the main call-to-action on any page. */
export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'Get tickets',
    iconRight: 'chevron-right',
  },
};

/** All variants — use to see the full range of visual styles */
export const AllVariants: Story = {
  render: () => (
    <StoryFrame id="atoms-button-all-variants" component="button" level="atom">
      <Button variant="primary">Primary</Button>
      <Button variant="dark">Dark</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
      <Button variant="discord">Discord</Button>
    </StoryFrame>
  ),
  parameters: { controls: { disable: true } },
};

/** All sizes */
export const AllSizes: Story = {
  render: () => (
    <StoryFrame id="atoms-button-all-sizes" component="button" level="atom">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </StoryFrame>
  ),
  parameters: { controls: { disable: true } },
};

/** Buttons with icons */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <Button variant="primary" iconLeft="chevron-right">Next step</Button>
      <Button variant="outline" iconLeft="calendar">Add to calendar</Button>
      <Button variant="ghost" iconLeft="edit">Edit</Button>
      <Button variant="outline" iconLeft="external">Open link</Button>
      <Button variant="dark" iconLeft="bell">Notify me</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** Loading state — shows spinner and disables interaction */
export const Loading: Story = {
  args: {
    children: 'Submitting…',
    isLoading: true,
  },
};

/** Disabled state */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

/** Full-width button */
export const FullWidth: Story = {
  args: {
    children: 'Get tickets',
    variant: 'primary',
    fullWidth: true,
  },
};

/** Danger variant — for destructive actions */
export const DangerVariant: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button variant="danger" iconLeft="trash">Delete show</Button>
      <Button variant="danger" iconLeft="x" isLoading>Cancel show</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** Discord variant — for Discord-related actions */
export const DiscordVariant: Story = {
  render: () => (
    <Button variant="discord" iconLeft="discord">Join Discord</Button>
  ),
  parameters: { controls: { disable: true } },
};

/** Icon-only button (square) — use with IconButton for toolbar actions */
export const IconOnly: Story = {
  render: () => (
    <StoryFrame id="atoms-button-icon-only" component="button" level="atom">
      <IconButton icon="trash" label="Delete" />
      <IconButton icon="edit" label="Edit" />
      <IconButton icon="calendar" label="Calendar" />
    </StoryFrame>
  ),
  parameters: { controls: { disable: true } },
};

/** Playground — explore all button combinations */
export const Playground: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    iconLeft: undefined,
    iconRight: 'chevron-right',
    isLoading: false,
    fullWidth: false,
    disabled: false,
  },
};
