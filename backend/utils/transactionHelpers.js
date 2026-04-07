const isScheduledTransaction = (date) => {
    const transactionDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    transactionDate.setHours(0, 0, 0, 0);
    return transactionDate > today;
};

module.exports = {
    isScheduledTransaction,
};
