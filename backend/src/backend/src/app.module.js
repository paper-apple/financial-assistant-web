"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const expenses_module_1 = require("./expenses/expenses.module");
const categories_module_1 = require("./categories/categories.module");
const locations_module_1 = require("./locations/locations.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const expense_entity_1 = require("./expenses/entities/expense.entity");
const category_entity_1 = require("./categories/entities/category.entity");
const location_entity_1 = require("./locations/entities/location.entity");
const user_entity_1 = require("./users/entities/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'postgres',
                database: 'expenses_db2',
                entities: [expense_entity_1.Expense, category_entity_1.Category, location_entity_1.Location, user_entity_1.User],
                synchronize: true,
                autoLoadEntities: true,
            }),
            expenses_module_1.ExpensesModule,
            categories_module_1.CategoriesModule,
            locations_module_1.LocationsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map