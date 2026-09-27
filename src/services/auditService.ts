import { AuditLogEntry } from '../types';
import { INITIAL_AUDIT_LOGS } from '../mock/initialData';

export class AuditService {
  private static logs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

  static getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  static logAction(params: {
    actor: string;
    role: string;
    action: string;
    targetId: string;
    oldState: string;
    newState: string;
  }): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: params.actor,
      role: params.role,
      action: params.action,
      targetId: params.targetId,
      oldState: params.oldState,
      newState: params.newState,
      ipAddress: '10.20.14.' + Math.floor(Math.random() * 200 + 10)
    };

    this.logs.unshift(newEntry);
    return newEntry;
  }

  static reset() {
    this.logs = [...INITIAL_AUDIT_LOGS];
  }

  static setLogs(logs: AuditLogEntry[]) {
    this.logs = [...logs];
  }
}
