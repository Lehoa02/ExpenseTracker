import moment from "moment-timezone";

export const getUserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || moment.tz.guess() || "UTC";

export const getMomentInUserTimeZone = (date) => moment.tz(date, getUserTimeZone());

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return passwordRegex.test(password);
};

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.trim().split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
};

export const addThousandSeparator = (num) => {
    if (num === null || num === undefined || num === "") return "";

    const normalizedValue = typeof num === "string" ? num.replace(/,/g, "").trim() : num;
    const numericValue = Number(normalizedValue);

    if (Number.isNaN(numericValue)) return "";

    const [integerPart, fractionalPart] = String(normalizedValue).split(".");
    const isNegative = integerPart.startsWith("-");
    const absoluteIntegerPart = isNegative ? integerPart.slice(1) : integerPart;
    const formattedInteger = absoluteIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart !== undefined && fractionalPart !== ""
        ? `${isNegative ? "-" : ""}${formattedInteger}.${fractionalPart}`
        : `${isNegative ? "-" : ""}${formattedInteger}`;
};

export const prepareExpenseBarChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category: item?.category,
        amount: item?.amount,
    }));

    return chartData;
};

export const filterExpensesByOverviewGroup = (data = [], groupBy = "7days") => {
    const validItems = [...data].filter((item) => item?.date);
    const timeZone = getUserTimeZone();

    if (groupBy === "7days") {
        const rangeEnd = moment.tz(timeZone).endOf("day");
        const rangeStart = rangeEnd.clone().subtract(6, "days").startOf("day");

        return validItems.filter((item) => {
            const date = moment.tz(item.date, timeZone);
            return date.isBetween(rangeStart, rangeEnd, "day", "[]");
        });
    }

    if (groupBy === "month") {
        const rangeEnd = moment.tz(timeZone).endOf("day");
        const rangeStart = rangeEnd.clone().subtract(5, "months").startOf("month");

        return validItems.filter((item) => {
            const date = moment.tz(item.date, timeZone);
            return date.isBetween(rangeStart, rangeEnd, "month", "[]");
        });
    }

    return validItems;
};

export const prepareExpenseCategoryChartData = (data = []) => {
    const groupedData = new Map();

    data.forEach((item) => {
        const category = item?.category?.trim();
        const amount = Number(item?.amount) || 0;

        if (!category) return;

        groupedData.set(category, (groupedData.get(category) || 0) + amount);
    });

    return Array.from(groupedData.entries())
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
};

export const prepareIncomeBarChartData = (data = [], groupBy = "month") => {
    const buckets = new Map();
    const validItems = [...data]
        .filter((item) => item?.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const timeZone = getUserTimeZone();

    const isThirtyDayView = groupBy === "30days";
    const isMonthView = groupBy === "month";
    const rangeEnd = moment.tz(timeZone).endOf("day");
    const rangeStart = rangeEnd.clone().subtract(29, "days").startOf("day");
    const monthRangeEnd = moment.tz(timeZone).endOf("month");
    const monthRangeStart = monthRangeEnd.clone().subtract(5, "months").startOf("month");
    const filteredItems = isThirtyDayView
        ? validItems.filter((item) => {
            const date = moment.tz(item.date, timeZone);
            return date.isBetween(rangeStart, rangeEnd, "day", "[]");
        })
        : isMonthView
            ? validItems.filter((item) => {
                const date = moment.tz(item.date, timeZone);
                return date.isBetween(monthRangeStart, monthRangeEnd, "month", "[]");
            })
        : validItems;

    const uniqueYears = new Set(filteredItems.map((item) => moment.tz(item.date, timeZone).format("YYYY")));
    const useShortMonthLabels = uniqueYears.size <= 1;

    filteredItems.forEach((item) => {
        const date = moment.tz(item.date, timeZone);
        const bucketKey =
                groupBy === "30days" || groupBy === "day"
                ? date.format("YYYY-MM-DD")
                : groupBy === "year"
                    ? date.format("YYYY")
                    : date.format("YYYY-MM");
        const label =
                groupBy === "30days" || groupBy === "day"
                ? (uniqueYears.size <= 1 ? date.format("Do MMM") : date.format("Do MMM YYYY"))
                : groupBy === "year"
                    ? date.format("YYYY")
                    : (useShortMonthLabels ? date.format("MMM") : date.format("MMM YYYY"));
        const amount = Number(item?.amount) || 0;
        const category = item?.source || "Income";

        if (!buckets.has(bucketKey)) {
            buckets.set(bucketKey, {
                bucketKey,
                groupBy,
                month: label,
                amount: 0,
                categories: new Set(),
            });
        }

        const bucket = buckets.get(bucketKey);
        bucket.amount += amount;
        bucket.categories.add(category);
    });

    return Array.from(buckets.entries())
        .sort(([bucketKeyA], [bucketKeyB]) => bucketKeyA.localeCompare(bucketKeyB))
        .map(([, value]) => ({
            bucketKey: value.bucketKey,
            groupBy: value.groupBy,
            month: value.month,
            amount: value.amount,
            category: value.categories.size === 1 ? Array.from(value.categories)[0] : "Multiple Incomes",
        }));
};

export const prepareIncomeCategoryChartData = (data = []) => {
    const groupedData = new Map();

    data.forEach((item) => {
        const source = item?.source?.trim();
        const amount = Number(item?.amount) || 0;

        if (!source) return;

        groupedData.set(source, (groupedData.get(source) || 0) + amount);
    });

    return Array.from(groupedData.entries())
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
};

export const prepareProfitBarChartData = (incomeData = [], expenseData = []) => {
    const timeZone = getUserTimeZone();

    const incomeItems = incomeData
        .filter((item) => item?.date)
        .map((item) => ({
            date: item.date,
            amount: Number(item?.amount) || 0,
            type: "income",
        }));

    const expenseItems = expenseData
        .filter((item) => item?.date)
        .map((item) => ({
            date: item.date,
            amount: Number(item?.amount) || 0,
            type: "expense",
        }));

    const allItems = [...incomeItems, ...expenseItems].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (allItems.length === 0) {
        return [];
    }

    const monthMoments = allItems.map((item) => moment.tz(item.date, timeZone).startOf("month"));
    const firstMonth = monthMoments.reduce((earliest, current) => (current.isBefore(earliest) ? current : earliest)).clone();
    const lastMonth = monthMoments.reduce((latest, current) => (current.isAfter(latest) ? current : latest)).clone();
    const useYearSuffix = firstMonth.year() !== lastMonth.year();

    const buckets = new Map();
    const cursor = firstMonth.clone();

    while (cursor.isSameOrBefore(lastMonth, "month")) {
        const bucketKey = cursor.format("YYYY-MM");

        buckets.set(bucketKey, {
            bucketKey,
            month: cursor.format(useYearSuffix ? "MMM YY" : "MMM"),
            income: 0,
            expense: 0,
            profit: 0,
            total: 0,
        });

        cursor.add(1, "month");
    }

    allItems.forEach((item) => {
        const bucketKey = moment.tz(item.date, timeZone).format("YYYY-MM");
        const bucket = buckets.get(bucketKey);

        if (!bucket) return;

        if (item.type === "income") {
            bucket.income += item.amount;
        } else {
            bucket.expense += item.amount;
        }

        bucket.profit = bucket.income - bucket.expense;
        bucket.total = bucket.profit;
    });

    return Array.from(buckets.values());
};

export const filterTransactionsByPeriod = (data = [], groupBy = "day", bucketKey = "") => {
    if (!bucketKey) {
        return data;
    }

    const timeZone = getUserTimeZone();

    return data.filter((item) => {
        if (!item?.date) return false;

        const date = moment.tz(item.date, timeZone);
        const currentKey =
            groupBy === "30days" || groupBy === "7days" || groupBy === "day"
                ? date.format("YYYY-MM-DD")
                : groupBy === "year"
                    ? date.format("YYYY")
                    : date.format("YYYY-MM");

        return currentKey === bucketKey;
    });
};

export const prepareExpenseLineChartData = (data = [], groupBy = "day") => {
    const buckets = new Map();
    const validItems = [...data]
        .filter((item) => item?.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const timeZone = getUserTimeZone();

    const filteredItems = filterExpensesByOverviewGroup(validItems, groupBy);

    const uniqueYears = new Set(filteredItems.map((item) => moment.tz(item.date, timeZone).format("YYYY")));
    const useShortMonthLabels = uniqueYears.size <= 1;

    filteredItems.forEach((item) => {
        const date = moment.tz(item.date, timeZone);
        const bucketKey =
            groupBy === "7days" || groupBy === "day"
                ? date.format("YYYY-MM-DD")
                : groupBy === "year"
                    ? date.format("YYYY")
                    : date.format("YYYY-MM");
        const label =
            groupBy === "7days" || groupBy === "day"
                ? (uniqueYears.size <= 1 ? date.format("Do MMM") : date.format("Do MMM YYYY"))
                : groupBy === "year"
                    ? date.format("YYYY")
                    : (useShortMonthLabels ? date.format("MMM") : date.format("MMM YYYY"));
        const amount = Number(item?.amount) || 0;
        const category = item?.category || "Expense";

        if (!buckets.has(bucketKey)) {
            buckets.set(bucketKey, {
                bucketKey,
                groupBy,
                month: label,
                amount: 0,
                categories: new Set(),
            });
        }

        const bucket = buckets.get(bucketKey);
        bucket.amount += amount;
        bucket.categories.add(category);
    });

    return Array.from(buckets.entries())
        .sort(([bucketKeyA], [bucketKeyB]) => bucketKeyA.localeCompare(bucketKeyB))
        .map(([, value]) => ({
            bucketKey: value.bucketKey,
            groupBy: value.groupBy,
            month: value.month,
            amount: value.amount,
            category: value.categories.size === 1 ? Array.from(value.categories)[0] : "Multiple Expenses",
        }));
};

export const filterExpensesByPeriod = (data = [], groupBy = "day", bucketKey = "") => {
    return filterTransactionsByPeriod(data, groupBy, bucketKey);
};

export const filterIncomeByPeriod = (data = [], groupBy = "day", bucketKey = "") => {
    return filterTransactionsByPeriod(data, groupBy, bucketKey);
};