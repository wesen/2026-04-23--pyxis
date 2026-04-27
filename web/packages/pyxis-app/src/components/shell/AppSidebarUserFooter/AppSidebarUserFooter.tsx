import { Avatar, Icon } from 'pyxis-components';
import './AppSidebarUserFooter.css';

export function AppSidebarUserFooter() {
  return <footer className="app-sidebar-user" data-section="app-sidebar-user"><Avatar name="Ada Dove" size="sm"/><div><strong>Ada Dove</strong><span>admin · online</span></div><Icon name="chevron-right" size={14}/></footer>;
}
