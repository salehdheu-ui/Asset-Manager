export interface FamilyMember {
  id: string;
  name: string;
  role: 'guardian' | 'custodian' | 'member';
  avatar: string;
}

export interface FundLayer {
  id: string;
  name: string;
  arabicName: string;
  percentage: number;
  amount: number;
  description: string;
  color: string;
  locked: boolean;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: 'access' | 'change' | 'transaction' | 'alert';
  description: string;
  actor: string;
  amount?: number;
  hash: string; // Fake hash for trust
}

export const CURRENT_USER: FamilyMember = {
  id: '1',
  name: 'Ahmed Al-Saidi',
  role: 'guardian',
  avatar: 'AH'
};

export const FUND_LAYERS: FundLayer[] = [
  {
    id: 'protected',
    name: 'Protected Capital',
    arabicName: 'رأس المال المحمي',
    percentage: 50,
    amount: 50000,
    description: 'Untouchable wealth foundation.',
    color: 'bg-primary',
    locked: true
  },
  {
    id: 'emergency',
    name: 'Emergency Reserve',
    arabicName: 'احتياطي الطوارئ',
    percentage: 20,
    amount: 20000,
    description: 'For unforeseen family crises.',
    color: 'bg-amber-600',
    locked: true
  },
  {
    id: 'flexible',
    name: 'Flexible Capital',
    arabicName: 'رأس المال المرن',
    percentage: 20,
    amount: 20000,
    description: 'For active loans and support.',
    color: 'bg-emerald-500',
    locked: false
  },
  {
    id: 'growth',
    name: 'Growth Capital',
    arabicName: 'رأس مال النمو',
    percentage: 10,
    amount: 10000,
    description: 'Locked until safety line reached.',
    color: 'bg-blue-600',
    locked: true
  }
];

export const TRUST_LEDGER: LedgerEntry[] = [
  {
    id: 'L-1023',
    date: '2024-05-15 14:30',
    type: 'access',
    description: 'Guardian Login Verified',
    actor: 'Ahmed Al-Saidi',
    hash: '0x8f...2a1'
  },
  {
    id: 'L-1022',
    date: '2024-05-14 09:15',
    type: 'transaction',
    description: 'Monthly Contribution Received',
    actor: 'System',
    amount: 500,
    hash: '0x7b...9c3'
  },
  {
    id: 'L-1021',
    date: '2024-05-10 18:45',
    type: 'change',
    description: 'Emergency Mode Deactivated',
    actor: 'Fatima Al-Saidi',
    hash: '0x3d...1e4'
  }
];
