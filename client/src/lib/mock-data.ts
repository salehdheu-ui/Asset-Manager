export interface FamilyMember {
  id: string;
  name: string;
  role: 'guardian' | 'custodian' | 'member';
  avatar: string;
  contributionStatus: 'paid' | 'pending';
  lastContribution?: string;
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
  type: 'access' | 'change' | 'transaction' | 'alert' | 'expense' | 'zakat' | 'charity' | 'contribution';
  description: string;
  actor: string;
  amount?: number;
  hash: string;
}

export const CURRENT_USER: FamilyMember = {
  id: '1',
  name: 'أحمد السعيدي',
  role: 'guardian',
  avatar: 'AH',
  contributionStatus: 'paid',
  lastContribution: '2024-05-01'
};

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'أحمد السعيدي', role: 'guardian', avatar: 'AH', contributionStatus: 'paid', lastContribution: '2024-05-01' },
  { id: '2', name: 'فاطمة السعيدي', role: 'member', avatar: 'FS', contributionStatus: 'pending' },
  { id: '3', name: 'علي السعيدي', role: 'member', avatar: 'AS', contributionStatus: 'paid', lastContribution: '2024-05-05' },
  { id: '4', name: 'ليلى السعيدي', role: 'member', avatar: 'LS', contributionStatus: 'pending' },
  { id: '5', name: 'سلطان السعيدي', role: 'custodian', avatar: 'SS', contributionStatus: 'paid', lastContribution: '2024-05-02' },
];

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
    id: 'L-1026',
    date: '2024-05-22 09:00',
    type: 'contribution',
    description: 'إيداع المساهمة الشهرية',
    actor: 'سلطان السعيدي',
    amount: 100,
    hash: '0x2d...8b4'
  },
  {
    id: 'L-1025',
    date: '2024-05-20 10:00',
    type: 'zakat',
    description: 'دفع الزكاة السنوية',
    actor: 'أحمد السعيدي',
    amount: 1250,
    hash: '0x1c...9a2'
  },
  {
    id: 'L-1024',
    date: '2024-05-18 16:45',
    type: 'charity',
    description: 'مساهمة خيرية (كفالة أيتام)',
    actor: 'فاطمة السعيدي',
    amount: 200,
    hash: '0x4e...3b1'
  }
];
