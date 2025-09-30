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

  async seedDummy(count: number = 50) {
    await prisma.$transaction([
      prisma.screener.deleteMany(),
      prisma.stock.deleteMany(),
    ]);

    const stocksData = Array.from({ length: count }).map((_, i) => {
      const base = 100 + i * 2;
      const ltp = generateRandomPrice(base, 25);
      return {
        symbol: `STK${String(i + 1).padStart(3, "0")}`,
        name: `Stock ${i + 1}`,
        ltp,
      };
    });

    const createdStocks = await prisma.$transaction(
      stocksData.map((s) =>
        prisma.stock.create({ data: { symbol: s.symbol, name: s.name, ltp: s.ltp } })
      )
    );

    await prisma.$transaction(
      createdStocks.map((stock) => {
        const price6m = generateRandomPrice(Number(stock.ltp), 20);
        const price1y = generateRandomPrice(Number(stock.ltp), 40);
        return prisma.screener.create({
          data: {
            stockId: stock.id,
            price_6m: price6m,
            price_1yr: price1y,
            isSelected: false,
          },
        });
      })
    );

    return { inserted: count };
  },
};


