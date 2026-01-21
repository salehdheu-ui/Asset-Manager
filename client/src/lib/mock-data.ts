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
  type: 'access' | 'change' | 'transaction' | 'alert' | 'expense' | 'zakat' | 'charity';
  description: string;
  actor: string;
  amount?: number;
  hash: string;
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
    description: 'أساس ثروة العائلة الذي لا يمس.',
    color: 'bg-primary',
    locked: true
  },
  {
    id: 'emergency',
    name: 'Emergency Reserve',
    arabicName: 'احتياطي الطوارئ',
    percentage: 20,
    amount: 20000,
    description: 'للأزمات العائلية غير المتوقعة.',
    color: 'bg-amber-600',
    locked: true
  },
  {
    id: 'flexible',
    name: 'Flexible Capital',
    arabicName: 'رأس المال المرن',
    percentage: 20,
    amount: 20000,
    description: 'للسلف والمصروفات والعمل الخيري.',
    color: 'bg-emerald-500',
    locked: false
  },
  {
    id: 'growth',
    name: 'Growth Capital',
    arabicName: 'رأس مال النمو',
    percentage: 10,
    amount: 10000,
    description: 'مقفل حتى الوصول لخط الأمان.',
    color: 'bg-blue-600',
    locked: true
  }
];

export const TRUST_LEDGER: LedgerEntry[] = [
  {
    id: 'L-1025',
    date: '2024-05-20 10:00',
    type: 'zakat',
    description: 'دفع الزكاة السنوية',
    actor: 'Ahmed Al-Saidi',
    amount: 1250,
    hash: '0x1c...9a2'
  },
  {
    id: 'L-1024',
    date: '2024-05-18 16:45',
    type: 'charity',
    description: 'مساهمة خيرية (كفالة أيتام)',
    actor: 'Fatima Al-Saidi',
    amount: 200,
    hash: '0x4e...3b1'
  },
  {
    id: 'L-1023',
    date: '2024-05-15 14:30',
    type: 'access',
    description: 'Guardian Login Verified',
    actor: 'Ahmed Al-Saidi',
    hash: '0x8f...2a1'
  }
];
