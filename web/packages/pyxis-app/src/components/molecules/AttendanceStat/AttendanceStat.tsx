import { appPart } from '../../parts';
import './AttendanceStat.css';

export type AttendanceStatProps = {
  label: string;
  value: string | number;
};

export function AttendanceStat({ label, value }: AttendanceStatProps) { return <div className="app-attendance-stat" {...appPart('attendance-stat')}><strong>{value}</strong><span>{label}</span></div>; }
