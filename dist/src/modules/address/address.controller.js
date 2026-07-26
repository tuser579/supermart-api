"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
const address_service_1 = require("./address.service");
exports.addressController = {
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        const addresses = await address_service_1.addressService.list(userId);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Addresses retrieved', addresses));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        const address = await address_service_1.addressService.create(userId, req.body);
        res.status(201).json(ApiResponse_1.ApiResponse.created('Address saved successfully', address));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        const address = await address_service_1.addressService.update(userId, req.params.id, req.body);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Address updated successfully', address));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        await address_service_1.addressService.delete(userId, req.params.id);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Address deleted successfully', null));
    }),
    setDefault: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.userId;
        const address = await address_service_1.addressService.setDefault(userId, req.params.id);
        res.status(200).json(ApiResponse_1.ApiResponse.success('Default address updated', address));
    }),
};
//# sourceMappingURL=address.controller.js.map