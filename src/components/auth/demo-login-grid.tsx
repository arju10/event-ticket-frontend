"use client";

import { DemoLoginButton } from "./demo-login-button";
import { DEMO_ACCOUNTS } from "@/lib/constants/demo-accounts";

export function DemoLoginGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DEMO_ACCOUNTS.map((account, index) => {
        // Third card spans both columns on desktop for a clean 2+1 layout
        const isLast = index === DEMO_ACCOUNTS.length - 1;
        return (
          <DemoLoginButton
            key={account.role}
            account={account}
            className={isLast ? "sm:col-span-2" : undefined}
          />
        );
      })}
    </div>
  );
}
