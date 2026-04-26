import { appPart } from '../parts';
import './AgeBadge.css';

export function AgeBadge({ children }: { children: string }) {
  return <span className="app-age-badge" {...appPart('age-badge')}>{children}</span>;
}
