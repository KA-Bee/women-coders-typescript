// Library members and how many books they can hold at once.
import type { Loan } from "./loans";

export type Tier = "standard" | "night_owl";

export interface Member {
  memberId: string;
  name: string;
  tier: Tier;
  loans: Loan[]; // books they have right now
  history: Loan[]; // loans they have returned
  lateReturns: number;
}

export function newMember(memberId: string, name: string, tier: Tier = "standard"): Member {
  return { memberId, name, tier, loans: [], history: [], lateReturns: 0 };
}

export function borrowLimit(member: Member): number {
  if (member.tier == "night_owl") {
    return 5;
  }
  return 3;
}

export function canBorrow(member: Member): boolean {
  return member.loans.length <= borrowLimit(member);
}
