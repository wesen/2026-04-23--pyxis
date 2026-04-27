import { PyxisLogo } from 'pyxis-components';
import { appPart } from '../../parts';
import { AppSidebarMenu } from '../AppSidebarMenu';
import { AppSidebarUserFooter } from '../AppSidebarUserFooter';
import './AppSidebar.css';

export function AppSidebar() {
  return <aside className="app-sidebar" data-section="app-sidebar" {...appPart('app-sidebar')}><div className="app-brand"><PyxisLogo size={26} stack /></div><AppSidebarMenu/><AppSidebarUserFooter/></aside>;
}
