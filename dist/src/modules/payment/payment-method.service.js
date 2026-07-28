"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSavedPaymentMethod = exports.addSavedPaymentMethod = exports.getSavedPaymentMethods = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSavedPaymentMethods = async (userId) => {
    return prisma.savedPaymentMethod.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getSavedPaymentMethods = getSavedPaymentMethods;
const addSavedPaymentMethod = async (data) => {
    if (data.isDefault) {
        // Unset other defaults
        await prisma.savedPaymentMethod.updateMany({
            where: { userId: data.userId },
            data: { isDefault: false },
        });
    }
    return prisma.savedPaymentMethod.create({
        data,
    });
};
exports.addSavedPaymentMethod = addSavedPaymentMethod;
const deleteSavedPaymentMethod = async (userId, id) => {
    return prisma.savedPaymentMethod.delete({
        where: {
            id,
            userId, // Ensure the method belongs to the user
        },
    });
};
exports.deleteSavedPaymentMethod = deleteSavedPaymentMethod;
//# sourceMappingURL=payment-method.service.js.map