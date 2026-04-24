import type { Meta, StoryObj } from '@storybook/react';
import { SaferSpaceAgreement } from './SaferSpaceAgreement';
const meta: Meta<typeof SaferSpaceAgreement> = { title: 'Public/Molecules/SaferSpaceAgreement', component: SaferSpaceAgreement, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof SaferSpaceAgreement>;
export const Default: Story = { args: {  }, render: (args) => <div style={{ width: 620 }}><SaferSpaceAgreement {...args} /></div> };
