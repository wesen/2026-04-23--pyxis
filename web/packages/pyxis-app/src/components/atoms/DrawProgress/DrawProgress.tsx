import { appPart } from '../../parts';
import './DrawProgress.css';

export function DrawProgress({ value, max }: { value: number; max: number }) {
  const percent = Math.min(100, (value / max) * 100);
  return <div className="app-draw-progress" data-over-capacity={value > max} {...appPart('draw-progress')}><span>{value}/{max}</span><i><b style={{ width: `${percent}%` }}/></i></div>;
}
