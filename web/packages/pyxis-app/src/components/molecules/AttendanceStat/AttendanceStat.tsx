import { appPart } from '../../parts';
import './AttendanceStat.css';
export function AttendanceStat({ label, value }: { label: string; value: string | number }) { return <div className="app-attendance-stat" {...appPart('attendance-stat')}><strong>{value}</strong><span>{label}</span></div>; }
