import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../../../api/mockData';
import { ShowDetailHero } from './ShowDetailHero';
const show = shows[0];
const meta: Meta = { title: 'Pyxis App/Components/Organisms/ShowDetailHero', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;
export const HeroMobile: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><ShowDetailHero show={show}/></div>, parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } } };
