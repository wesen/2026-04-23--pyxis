import { appPart } from '../../parts';
import './DrawProgress.css';

export type DrawProgressProps = {
  value: number;
  max: number;
};

export function DrawProgress({ value, max }: DrawProgressProps) {
  const percent = Math.min(100, (value / max) * 100);
  return <div className="app-draw-progress" data-over-capacity={value > max} {...appPart('draw-progress')}><span>{value}/{max}</span><i><b style={{ width: `${percent}%` }}/></i></div>;
}
