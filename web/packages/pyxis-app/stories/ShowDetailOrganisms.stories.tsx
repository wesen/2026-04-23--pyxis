import type { Meta, StoryObj } from '@storybook/react';
import { shows } from '../src/api/mockData';
import { ShowDetailDiscordPanel, ShowDetailHero, ShowDetailInfoPanel } from '../src/components/organisms/Phase8Sections';

const show = shows[0];
const meta: Meta = { title: 'Pyxis App/Organisms/ShowDetail', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

export const HeroMobile: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-mobile-canvas)' }}><ShowDetailHero show={show}/></div>, parameters: { viewport: { defaultViewport: 'pyxisAppMobile' } } };
export const InfoPanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailInfoPanel show={show}/></div> };
export const DiscordPanel: Story = { render: () => <div style={{ width: 390, padding: 14, background: 'var(--app-canvas)' }}><ShowDetailDiscordPanel/></div> };
