// TypeScript interface for Bloomberg real-time pricing
// Mirrors the simplified PriceUpdate model from backend models.py

export interface PriceUpdate {
  instrument_id: number;
  price: number;
  dtd_daily_return: number | null;
  dtd_percent_return: number | null;
  mtd_daily_return: number | null;
  mtd_percent_return: number | null;
  qtd_daily_return: number | null;
  qtd_percent_return: number | null;
  ytd_daily_return: number | null;
  ytd_percent_return: number | null;
  timestamp: string; // ISO datetime string
}
