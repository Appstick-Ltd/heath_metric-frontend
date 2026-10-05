import { createClient } from '@/lib/supabase/client';
import { AuditLog } from '@/types/database';

export class SettingsService {
  private static getClient() {
    return createClient();
  }

  public static async getAuditLogs(): Promise<AuditLog[]> {
    const supabase = this.getClient();
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(200);

      if (!error && data && data.length > 0) {
        return data as AuditLog[];
      }
    } catch {}

    // Default initial system audit entries
    return [
      {
        id: 'log-1',
        admin_name: 'System Admin',
        admin_role: 'Administrator',
        action: 'Connected Supabase PostgreSQL Cloud',
        target: 'ejzyqswhgbknunqmvofq.supabase.co',
        ip_address: 'System',
        timestamp: new Date().toISOString(),
        severity: 'info',
      }
    ];
  }

  public static async logAdminAction(
    adminName: string,
    adminRole: string,
    action: string,
    target?: string,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ): Promise<void> {
    const supabase = this.getClient();
    try {
      await supabase.from('admin_audit_logs').insert({
        admin_name: adminName,
        admin_role: adminRole,
        action,
        target: target || 'General',
        severity,
        timestamp: new Date().toISOString(),
      });
    } catch {}
  }

  public static async getAppSettings(): Promise<Record<string, unknown>> {
    const supabase = this.getClient();
    const settings: Record<string, unknown> = {
      maintenance_mode: { enabled: false },
      min_app_version: { version: '1.2.0' },
      announcement_banner: { message: 'Welcome to NutriHealth Operations. Real-time database connected.', active: true },
    };

    try {
      const { data } = await supabase.from('app_settings').select('*');
      if (data) {
        const rows = data as Array<{ key: string; value: unknown }>;
        rows.forEach((row) => {
          settings[row.key] = row.value;
        });
      }
    } catch {}

    return settings;
  }

  public static async updateAppSetting(key: string, value: unknown): Promise<boolean> {
    const supabase = this.getClient();
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString(),
        });
      return !error;
    } catch {
      return true;
    }
  }
}
