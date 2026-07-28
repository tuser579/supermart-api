"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
// We can protect these routes so only logged in users can access them
router.use(auth_middleware_1.authMiddleware);
router.post('/bank', payment_controller_1.paymentController.processBankTransfer);
router.post('/card', payment_controller_1.paymentController.processCardPayment);
// Saved Payment Methods
router.get('/methods', payment_controller_1.paymentController.getSavedMethods);
router.post('/methods', payment_controller_1.paymentController.addSavedMethod);
router.delete('/methods/:id', payment_controller_1.paymentController.deleteSavedMethod);
router.post('/verify-mobile-banking', payment_controller_1.paymentController.verifyMobileBanking);
exports.paymentRoutes = router;
//# sourceMappingURL=payment.routes.js.map