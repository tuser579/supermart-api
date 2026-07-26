import { Request, Response } from 'express';
import { ApiError } from '../../shared/utils/ApiError';
import * as paymentMethodService from './payment-method.service';

export const paymentController = {
  processBankTransfer: async (req: Request, res: Response) => {
    try {
      const { bankName, accountNumber, amount } = req.body;

      if (!bankName || !accountNumber || !amount) {
        throw ApiError.badRequest('Bank name, account number, and amount are required');
      }

      // Simulate a bank transfer processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real application, you would integrate with a payment gateway here.
      // For now, we'll just mock a successful response.
      const transactionId = `BNK-${Date.now().toString(36).toUpperCase()}`;

      res.status(200).json({
        success: true,
        message: 'Bank transfer processed successfully',
        data: {
          transactionId,
          bankName,
          accountNumber: `****${accountNumber.slice(-4)}`, // Mask account number for security
          amount,
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Internal server error during bank transfer' });
      }
    }
  },

  processCardPayment: async (req: Request, res: Response) => {
    try {
      const { cardNumber, expiryDate, cvv, amount } = req.body;

      if (!cardNumber || !expiryDate || !cvv || !amount) {
        throw ApiError.badRequest('Card number, expiry date, CVV, and amount are required');
      }

      // Simulate a card processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation logic
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        throw ApiError.badRequest('Invalid card number');
      }

      // In a real application, you would integrate with a payment gateway here (e.g. Stripe).
      const transactionId = `CRD-${Date.now().toString(36).toUpperCase()}`;

      res.status(200).json({
        success: true,
        message: 'Card payment processed successfully',
        data: {
          transactionId,
          cardMasked: `**** **** **** ${cardNumber.slice(-4)}`,
          amount,
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Internal server error during card payment' });
      }
    }
  },

  getSavedMethods: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const methods = await paymentMethodService.getSavedPaymentMethods(userId);
      res.status(200).json({ success: true, data: methods });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching payment methods' });
    }
  },

  addSavedMethod: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { type, provider, last4, isDefault } = req.body;
      
      if (!type || !provider) {
        throw ApiError.badRequest('Type and provider are required');
      }

      const newMethod = await paymentMethodService.addSavedPaymentMethod({
        userId,
        type,
        provider,
        last4,
        isDefault
      });

      res.status(201).json({ success: true, data: newMethod, message: 'Payment method saved' });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Error saving payment method' });
      }
    }
  },

  deleteSavedMethod: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const id = req.params.id as string;

      await paymentMethodService.deleteSavedPaymentMethod(userId, id);
      res.status(200).json({ success: true, message: 'Payment method deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting payment method' });
    }
  }
};
