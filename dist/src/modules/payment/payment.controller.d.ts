import { Request, Response } from 'express';
export declare const paymentController: {
    processBankTransfer: (req: Request, res: Response) => Promise<void>;
    processCardPayment: (req: Request, res: Response) => Promise<void>;
    getSavedMethods: (req: Request, res: Response) => Promise<void>;
    addSavedMethod: (req: Request, res: Response) => Promise<void>;
    deleteSavedMethod: (req: Request, res: Response) => Promise<void>;
    verifyMobileBanking: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=payment.controller.d.ts.map