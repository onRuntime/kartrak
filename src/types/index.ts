export type TabTime = {
  url: string;
  favIconUrl?: string;
  startAt: string;
  endAt?: string;
};

export type Analyze = {
  url: string;
  requestAmount: number;
  updatedAt?: string;
};