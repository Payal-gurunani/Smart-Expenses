const API_BASE_URI = import.meta.env.VITE_API_BACKEND_URL;
const API_VERSION = "v1";

const buildUrl = (path) => `${API_BASE_URI}/api/${API_VERSION}${path}`;
export const Methods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH"
}
export const endpoints = {
    Register: {
        url: buildUrl('/users/register'),
        method: Methods.POST
    },
    Login: {
        url: buildUrl("/users/login"), method: Methods.POST
    },
    Logout: {
        url: buildUrl("/users/logout"),
        method: Methods.GET
    },
    CreateExpense: {
        url: buildUrl("/expenses/create-expense"),
        method: Methods.POST
    },
    GetExpense: {
        url: buildUrl("/expenses/get-expenses"),
        method: Methods.GET
    },
    GetExpenseById: (expenseId) => ({
        url: buildUrl(`/expenses/expense/${expenseId}`),
        method: Methods.GET
    }),
    UpdateExpense: (expenseId) => ({
        url: buildUrl(`/expenses/expense/${expenseId}`),
        method: Methods.PUT
    }),
    DeleteExpense: (expenseId) => ({
        url: buildUrl(`/expenses/expense/${expenseId}`),
        method: Methods.DELETE
    }),
    Summary: {
        url: buildUrl("/expenses/summary"),
        method: Methods.GET
    }
}