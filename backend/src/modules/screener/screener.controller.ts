import { Request, Response } from "express";
import { ScreenerService } from "./screener.service";
import prisma from "../../shared/prisma";

export const ScreenerController = {
  async uploadStocks(req: Request, res: Response) {
    console.log("Received stocks payload:", req.body);
    const { stocks } = req.body as { stocks: { symbol: string; ltp: string, priority: number }[] };
    if (!Array.isArray(stocks)) {
      console.error("Invalid stocks payload");
      return res.status(400).json({ error: "Invalid stocks" });
    }

    // Clean screener table
    await prisma.screener.deleteMany();
    console.log("Screener table cleaned");

    let inserted = 0, updated = 0, skipped = 0;
    for (const stockObj of stocks) {
      // skip if priority === 1
      if (stockObj.priority === 1) {
        console.log(`Skipping stock with priority=1: symbol='${stockObj.symbol}'`);
        skipped++;
        continue;
      }
      const { symbol, ltp } = stockObj;
      const ltpValue = Number(ltp);
      if (!symbol || isNaN(ltpValue)) {
        console.warn(`Skipping invalid row: symbol='${symbol}', ltp='${ltp}'`);
        skipped++;
        continue;
      }
      let stock = await prisma.stock.findUnique({ where: { symbol } });
      if (stock) {
        stock = await prisma.stock.update({ where: { id: stock.id }, data: { ltp: ltpValue } });
        updated++;
        console.log(`Updated stock: symbol='${symbol}', ltp=${ltpValue}`);
      } else {
        stock = await prisma.stock.create({ data: { symbol, name: symbol, ltp: ltpValue } });
        inserted++;
        console.log(`Created stock: symbol='${symbol}', ltp=${ltpValue}`);
      }
      await prisma.screener.create({
        data: {
          stockId: stock.id,
          price_6m: stock.ltp,
          price_1yr: stock.ltp,
          isSelected: false,
        },
      });
      console.log(`Inserted screener row for: symbol='${symbol}'`);
    }
    console.log(`Upload complete. Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
    res.json({ success: true, inserted, updated, skipped });
  },
  async list(req: Request, res: Response) {
    const rows = await ScreenerService.list();
    res.json(rows);
  },

  async seed(req: Request, res: Response) {
    const count = Number(req.query.count ?? 50);
    const result = await ScreenerService.seedDummy(count);
    res.json(result);
  },

  async toggle(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { isSelected } = req.body as { isSelected: boolean };
    const updated = await ScreenerService.toggleSelection(id, Boolean(isSelected));
    res.json(updated);
  },
};


