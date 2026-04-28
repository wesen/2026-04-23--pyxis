import { Avatar, Icon } from 'pyxis-components';
import { useGetSessionQuery, useLogoutMutation } from '../../../api/appApi';
import './AppSidebarUserFooter.css';

export function AppSidebarUserFooter() {
  const { data: session } = useGetSessionQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const user = session?.user;
  const name = user?.discordUsername || 'Staff';
  const role = user?.role || 'staff';

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      window.location.assign('/login');
    }
  };

  return (
    <footer className="app-sidebar-user" data-section="app-sidebar-user">
      <Avatar name={name} size="sm" />
      <div>
        <strong>{name}</strong>
        <span>{role} · online</span>
      </div>
      <button type="button" className="app-sidebar-user__logout" onClick={handleLogout} disabled={isLoading} aria-label="Log out">
        <Icon name="chevron-right" size={14} />
      </button>
    </footer>
  );
}
