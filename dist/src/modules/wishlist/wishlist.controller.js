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
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const wishlistService = __importStar(require("./wishlist.service"));
const getWishlist = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const wishlist = await wishlistService.getWishlist(userId);
        res.status(200).json({ success: true, data: wishlist });
    }
    catch (error) {
        next(error);
    }
};
exports.getWishlist = getWishlist;
const addToWishlist = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'productId is required' });
        }
        const item = await wishlistService.addToWishlist(userId, productId);
        res.status(201).json({ success: true, data: item, message: 'Added to wishlist' });
    }
    catch (error) {
        next(error);
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;
        await wishlistService.removeFromWishlist(userId, productId);
        res.status(200).json({ success: true, message: 'Removed from wishlist' });
    }
    catch (error) {
        next(error);
    }
};
exports.removeFromWishlist = removeFromWishlist;
//# sourceMappingURL=wishlist.controller.js.map