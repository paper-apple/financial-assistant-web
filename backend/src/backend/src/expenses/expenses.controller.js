"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const expenses_service_1 = require("./expenses.service");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
const auth_guard_1 = require("../auth/auth.guard");
const common_1 = require("@nestjs/common");
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    create(createExpenseDto, req) {
        return this.expensesService.create(createExpenseDto, req.userId);
    }
    findAll(req, minPrice, maxPrice, startDate, endDate, sortField, sortDirection, keywords) {
        const filters = {
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            keywords: keywords || [],
        };
        const sortParams = sortField ? {
            field: sortField,
            direction: sortDirection || 'ASC'
        } : undefined;
        return this.expensesService.findAll(req.userId, filters, sortParams);
    }
    findOne(id, req) {
        return this.expensesService.findOne(id, req.userId);
    }
    update(id, updateExpenseDto, req) {
        return this.expensesService.update(id, updateExpenseDto, req.userId);
    }
    remove(id, req) {
        return this.expensesService.remove(id, req.userId);
    }
    suggestKeywords(req, query, field) {
        return this.expensesService.suggestKeywords(query, req.userId, field);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_expense_dto_1.CreateExpenseDto !== "undefined" && create_expense_dto_1.CreateExpenseDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('minPrice')),
    __param(2, (0, common_1.Query)('maxPrice')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('sortField')),
    __param(6, (0, common_1.Query)('sortDirection')),
    __param(7, (0, common_1.Query)('keywords')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Date,
        Date, String, String, Array]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_c = typeof update_expense_dto_1.UpdateExpenseDto !== "undefined" && update_expense_dto_1.UpdateExpenseDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('keywords/suggest'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('query')),
    __param(2, (0, common_1.Query)('field')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "suggestKeywords", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, common_1.Controller)('expenses'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof expenses_service_1.ExpensesService !== "undefined" && expenses_service_1.ExpensesService) === "function" ? _a : Object])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map