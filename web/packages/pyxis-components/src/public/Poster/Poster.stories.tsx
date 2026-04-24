import type { Meta, StoryObj } from '@storybook/react';
import { Poster, type PosterKind } from './Poster';

const meta: Meta<typeof Poster> = { title: 'Public/Molecules/Poster', component: Poster, tags: ['autodocs'], args: { kind: 'redroom' } };
export default meta;
type Story = StoryObj<typeof Poster>;
export const Default: Story = { render: (args) => <div style={{ width: 270 }}><Poster {...args} /></div> };
const kinds: PosterKind[] = ['redroom', 'pixel808', 'petals', 'meetups', 'basement', 'orphx', 'moor', 'cygnus', 'zola'];
export const AllVariants: Story = { render: () => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 180px)', gap: 18 }}>{kinds.map(kind => <Poster key={kind} kind={kind} />)}</div> };
