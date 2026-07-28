"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const paymentMethodService = __importStar(require("./payment-method.service"));
exports.paymentController = {
    processBankTransfer: async (req, res) => {
        try {
            const { bankName, accountNumber, amount } = req.body;
            if (!bankName || !accountNumber || !amount) {
                throw ApiError_1.ApiError.badRequest('Bank name, account number, and amount are required');
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
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({ success: false, message: error.message });
            }
            else {
                res.status(500).json({ success: false, message: 'Internal server error during bank transfer' });
            }
        }
    },
    processCardPayment: async (req, res) => {
        try {
            const { cardNumber, expiryDate, cvv, amount } = req.body;
            if (!cardNumber || !expiryDate || !cvv || !amount) {
                throw ApiError_1.ApiError.badRequest('Card number, expiry date, CVV, and amount are required');
            }
            // Simulate a card processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Mock validation logic
            if (cardNumber.length < 13 || cardNumber.length > 19) {
                throw ApiError_1.ApiError.badRequest('Invalid card number');
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
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({ success: false, message: error.message });
            }
            else {
                res.status(500).json({ success: false, message: 'Internal server error during card payment' });
            }
        }
    },
    getSavedMethods: async (req, res) => {
        try {
            const userId = req.user.userId;
            const methods = await paymentMethodService.getSavedPaymentMethods(userId);
            res.status(200).json({ success: true, data: methods });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching payment methods' });
        }
    },
    addSavedMethod: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { type, provider, last4, isDefault } = req.body;
            if (!type || !provider) {
                throw ApiError_1.ApiError.badRequest('Type and provider are required');
            }
            const newMethod = await paymentMethodService.addSavedPaymentMethod({
                userId,
                type,
                provider,
                last4,
                isDefault
            });
            res.status(201).json({ success: true, data: newMethod, message: 'Payment method saved' });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({ success: false, message: error.message });
            }
            else {
                res.status(500).json({ success: false, message: 'Error saving payment method' });
            }
        }
    },
    deleteSavedMethod: async (req, res) => {
        try {
            const userId = req.user.userId;
            const id = req.params.id;
            await paymentMethodService.deleteSavedPaymentMethod(userId, id);
            res.status(200).json({ success: true, message: 'Payment method deleted' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error deleting payment method' });
        }
    },
    verifyMobileBanking: async (req, res) => {
        try {
            const { paymentMethod, transactionId, amount, senderPhone } = req.body;
            if (!paymentMethod || !transactionId || !amount) {
                throw ApiError_1.ApiError.badRequest('Payment method, transaction ID, and amount are required');
            }
            const validMethods = ['BKASH', 'ROCKET', 'NOGOD'];
            if (!validMethods.includes(paymentMethod.toUpperCase())) {
                throw ApiError_1.ApiError.badRequest('Invalid mobile banking payment method. Must be BKASH, ROCKET, or NOGOD.');
            }
            if (transactionId.trim().length < 4) {
                throw ApiError_1.ApiError.badRequest('Invalid transaction ID');
            }
            res.status(200).json({
                success: true,
                message: 'Mobile banking payment verified and recorded',
                data: {
                    transactionId: transactionId.trim().toUpperCase(),
                    paymentMethod: paymentMethod.toUpperCase(),
                    amount: Number(amount),
                    senderPhone: senderPhone || null,
                    status: 'PENDING_VERIFICATION',
                },
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({ success: false, message: error.message });
            }
            else {
                res.status(500).json({ success: false, message: 'Internal server error during mobile banking verification' });
            }
        }
    }
};
//# sourceMappingURL=payment.controller.js.map