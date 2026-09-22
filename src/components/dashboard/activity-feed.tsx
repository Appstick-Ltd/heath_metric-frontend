import * as React from "react";
import { AlertCircle, UserPlus, CreditCard, Gift, HeartPulse } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityEvent } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const getIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "vital_alert":
        return <HeartPulse className="h-4 w-4 text-rose-500" />;
      case "subscription_new":
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case "user_register":
        return <UserPlus className="h-4 w-4 text-sky-500" />;
      case "referral_claim":
        return <Gift className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: ActivityEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge variant="danger">Critical Alert</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      default:
        return <Badge variant="default">General</Badge>;
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Live Clinical & Platform Activity Stream</CardTitle>
          <CardDescription>
            Real-time vital alerts, subscriptions, and patient registrations
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="py-3.5 flex items-start justify-between gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-xl mt-0.5",
                    evt.severity === "critical"
                      ? "bg-rose-50 dark:bg-rose-950/50"
                      : "bg-slate-100 dark:bg-slate-800"
                  )}
                >
                  {getIcon(evt.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {evt.title}
                    </h4>
                    {getSeverityBadge(evt.severity)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {evt.description}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 mt-0.5 font-medium">
                {evt.timestamp}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
