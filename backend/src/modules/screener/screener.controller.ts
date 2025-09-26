import { Request, Response } from "express";
import { ScreenerService } from "./screener.service";

export const ScreenerController = {
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


