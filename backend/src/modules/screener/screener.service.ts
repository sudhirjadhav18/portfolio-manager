import prisma from "../../shared/prisma";

export type ScreenerRow = {
  id: number;
  stockId: number;
  symbol: string;
  name: string;
  ltp: string; // decimal as string
  price_6m: string; // decimal as string
  price_1yr: string; // decimal as string
  isSelected: boolean;
};

function generateRandomPrice(base: number, variance: number): number {
  const delta = (Math.random() * 2 - 1) * variance;
  return Math.max(1, base + delta);
}

export const ScreenerService = {
  async list(): Promise<ScreenerRow[]> {
    const rows = await prisma.screener.findMany({
      include: { stock: true },
      orderBy: [
        { isSelected: "desc" },
        { stock: { symbol: "asc" } },
      ],
    });

    return rows.map((r) => ({
      id: r.id,
      stockId: r.stockId,
        symbol: r.stock?.symbol ?? "",
      name: r.stock?.name ?? "",
      ltp: r.stock?.ltp?.toString() ?? "0",
      price_6m: r.price_6m.toString(),
      price_1yr: r.price_1yr.toString(),
      isSelected: r.isSelected,
    }));
  },

  async toggleSelection(id: number, isSelected: boolean) {
    const updated = await prisma.screener.update({
      where: { id },
      data: { isSelected },
      include: { stock: true },
    });
    return {
      id: updated.id,
      stockId: updated.stockId,
        symbol: updated.stock?.symbol ?? "",
      name: updated.stock?.name ?? "",
      ltp: updated.stock?.ltp?.toString() ?? "0",
      price_6m: updated.price_6m.toString(),
      price_1yr: updated.price_1yr.toString(),
      isSelected: updated.isSelected,
    } as ScreenerRow;
  },
};


