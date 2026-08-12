// types/index.ts
export interface DashboardStats {
  totalMembers: number;
  membersDelta: number;
  issuedBooks: number;
  issuedDelta: number;
  totalBooks: number;
  totalBooksDelta: number;
  totalFine: number;
  fineDelta: number;
}

export interface BooksOverview {
  labels: string[];
  issued: number[];
  returned: number[];
}

export interface ActivityItem {
  iconName: string;
  text: string;
  time: string;
}

export interface IssuedBookRow {
  title: string;
  member: string;
  issueDate: string;
  dueDate: string;
  status: "Issued" | "Returned" | "Overdue";
}

export interface TopBookSlice {
  name: string;
  value: number;
  color: string;
}

export interface RecommendedBook {
  id: number;
  title: string;
  author: string;
  category: string | null;
  available_copies: number;
  times_issued?: number;
}
